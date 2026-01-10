'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import GithubSlugger from 'github-slugger';
import { TextPageConfig } from '@/types/page';
import { useEffect, useMemo, useState } from 'react';

import type { Pluggable } from 'unified';
import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';
import type { Heading, PhrasingContent, Text, InlineCode } from 'mdast';
import type { ComponentPropsWithoutRef } from 'react';

interface TextPageProps {
  config: TextPageConfig;
  content: string;
  embedded?: boolean;
}

type TocNode = { id: string; text: string; children: { id: string; text: string }[] };

type AnchorProps = ComponentPropsWithoutRef<'a'>;

/**
 * Stable slug plugin for headings (## / ###)
 * Avoids remark-slug dependency/type conflicts.
 */
const remarkSlugStable: Pluggable = () => {
  return (tree: Root) => {
    const slugger = new GithubSlugger();
    slugger.reset();

    visit(tree, 'heading', (node) => {
      const heading = node as Heading;
      const depth = heading.depth;
      if (depth < 2 || depth > 3) return;

      // Extract plain text from heading children
      const text = (heading.children || [])
        .map((c: PhrasingContent) => {
          if (c.type === 'text') return (c as Text).value ?? '';
          if (c.type === 'inlineCode') return (c as InlineCode).value ?? '';
          return '';
        })
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (!text) return;

      const id = slugger.slug(text);

      heading.data = heading.data || {};
      heading.data.hProperties = heading.data.hProperties || {};
      (heading.data.hProperties as Record<string, unknown>).id = id;
    });
  };
};

export default function TextPage({ config, content, embedded = false }: TextPageProps) {
  // Build TOC from markdown, skipping fenced code blocks so TOC matches real headings.
  const tocTree: TocNode[] = useMemo(() => {
    const slugger = new GithubSlugger();
    slugger.reset();

    const headings: { depth: 2 | 3; text: string; id: string }[] = [];

    const lines = content.split('\n');
    let inFence = false;
    let fenceToken: '```' | '~~~' | null = null;

    for (const rawLine of lines) {
      const line = rawLine.trim();

      // Toggle fenced code blocks ``` or ~~~
      const fenceMatch = /^(```|~~~)/.exec(line);
      if (fenceMatch) {
        const token = fenceMatch[1] as '```' | '~~~';
        if (!inFence) {
          inFence = true;
          fenceToken = token;
        } else if (fenceToken === token) {
          inFence = false;
          fenceToken = null;
        }
        continue;
      }
      if (inFence) continue;

      const match = /^(#{2,3})\s+(.*)/.exec(line);
      if (!match) continue;

      const depth = match[1].length as 2 | 3;
      const text = match[2].trim();
      const id = slugger.slug(text);

      headings.push({ depth, text, id });
    }

    const tree: TocNode[] = [];
    headings.forEach((h) => {
      if (h.depth === 2) tree.push({ id: h.id, text: h.text, children: [] });
      else if (h.depth === 3 && tree.length > 0) tree[tree.length - 1].children.push({ id: h.id, text: h.text });
    });

    return tree;
  }, [content]);

  const allIds = useMemo(() => {
    const ids: string[] = [];
    tocTree.forEach((t) => {
      ids.push(t.id);
      t.children.forEach((c) => ids.push(c.id));
    });
    return ids;
  }, [tocTree]);

  const [activeId, setActiveId] = useState<string>('');

  const activeParentId = useMemo(() => {
    if (!activeId) return '';
    for (const t of tocTree) {
      if (t.id === activeId) return t.id;
      if (t.children.some((c) => c.id === activeId)) return t.id;
    }
    return '';
  }, [activeId, tocTree]);

  // Scroll-based highlighting: active = last heading above threshold
  useEffect(() => {
    if (embedded) return;
    if (!allIds.length) return;
    if (typeof window === 'undefined') return;

    const threshold = 120; // px below top where a section becomes "active"

    const computeActive = () => {
      let current = '';
      for (const id of allIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= threshold) current = id;
      }
      setActiveId(current || allIds[0] || '');
    };

    const t = window.setTimeout(() => {
      computeActive();
      window.addEventListener('scroll', computeActive, { passive: true });
      window.addEventListener('resize', computeActive);
    }, 0);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener('scroll', computeActive);
      window.removeEventListener('resize', computeActive);
    };
  }, [allIds, embedded]);

  const jumpTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    setActiveId(id);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className={embedded ? '' : 'max-w-7xl mx-auto'}
    >
      <div className="flex gap-8">
        {!embedded && tocTree.length > 0 && (
          <aside className="hidden lg:block w-64 sticky top-28 h-fit self-start">
            <div className="text-sm font-semibold text-primary mb-3">On this page</div>

            <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              {tocTree.map((item) => {
                const parentActive = item.id === activeParentId;
                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => jumpTo(item.id)}
                      className={[
                        'block w-full text-left whitespace-normal break-words leading-snug transition-colors cursor-pointer',
                        parentActive ? 'text-accent font-medium' : 'hover:text-accent',
                      ].join(' ')}
                    >
                      {item.text}
                    </button>

                    {item.children.length > 0 && (
                      <div className="ml-3 space-y-1">
                        {item.children.map((child) => {
                          const childActive = child.id === activeId;
                          return (
                            <button
                              key={child.id}
                              type="button"
                              onClick={() => jumpTo(child.id)}
                              className={[
                                'block w-full text-left text-[13px] whitespace-normal break-words leading-snug transition-colors cursor-pointer',
                                childActive ? 'text-accent font-medium' : 'hover:text-accent',
                              ].join(' ')}
                            >
                              {child.text}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>
        )}

        <div className="flex-1 min-w-0">
          <header className={embedded ? 'mb-6 space-y-2' : 'mb-12 space-y-3'}>
            <h1 className={`${embedded ? 'text-2xl' : 'text-4xl'} font-serif font-bold text-primary`}>
              {config.title}
            </h1>
            {config.description && (
              <p className="text-base text-neutral-600 dark:text-neutral-500 max-w-2xl leading-relaxed">
                {config.description}
              </p>
            )}
          </header>

          <div className="text-neutral-700 dark:text-neutral-600 leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkSlugStable]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h1: ({ children, ...props }) => (
                  <h1 {...props} className="text-3xl font-serif font-bold text-primary mt-8 mb-4">
                    {children}
                  </h1>
                ),
                h2: ({ children, ...props }) => (
                  <h2
                    {...props}
                    className="scroll-mt-28 text-2xl font-serif font-bold text-primary mt-8 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2"
                  >
                    {children}
                  </h2>
                ),
                h3: ({ children, ...props }) => (
                  <h3 {...props} className="scroll-mt-28 text-xl font-semibold text-primary mt-6 mb-3">
                    {children}
                  </h3>
                ),
                p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1 ml-4">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1 ml-4">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                a: ({ href, children, ...props }: AnchorProps) => {
                  const isThisPage =
                    typeof config.source === 'string' &&
                    config.source.includes('mood_tracking_2025'); // ← change to your md filename

                  const isHash = href?.startsWith('#') ?? false;

                  // Default: open in new tab
                  let target: string | undefined = '_blank';
                  let rel: string | undefined = 'noopener noreferrer';

                  // ONLY on this page: hash links stay in same tab
                  if (isThisPage && isHash) {
                    target = undefined;
                    rel = undefined;
                  }

                  return (
                    <a
                      href={href}
                      {...props}
                      target={target}
                      rel={rel}
                      className="text-accent font-medium hover:underline transition-colors"
                    >
                      {children}
                    </a>
                  );
                },
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600 dark:text-neutral-500">
                    {children}
                  </blockquote>
                ),
                strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                em: ({ children }) => <em className="italic text-neutral-600 dark:text-neutral-500">{children}</em>,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </motion.div>
  );
}