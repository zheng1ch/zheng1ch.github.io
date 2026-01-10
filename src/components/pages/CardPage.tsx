'use client';

import { motion } from 'framer-motion';
import { CardPageConfig } from '@/types/page';
import Link from 'next/link';
import Image from 'next/image';

export default function CardPage({
  config,
  embedded = false,
}: {
  config: CardPageConfig;
  embedded?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className={embedded ? 'mb-4' : 'mb-8'}>
        <h1 className={`${embedded ? 'text-2xl' : 'text-4xl'} font-serif font-bold text-primary mb-4`}>
          {config.title}
        </h1>
        {config.description && (
          <p className={`${embedded ? 'text-base' : 'text-lg'} text-neutral-600 dark:text-neutral-500 max-w-2xl`}>
            {config.description}
          </p>
        )}
      </div>

      <div className={`grid ${embedded ? 'gap-4' : 'gap-6'}`}>
        {config.items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
            className={`bg-white dark:bg-neutral-900 ${embedded ? 'p-4' : 'p-6'} rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all duration-200 hover:scale-[1.01]`}
          >
            {/* Row layout: text left, image right */}
            <div className="flex flex-col md:flex-row md:items-stretch gap-6 w-full">
              {/* TEXT COLUMN */}
              <div className="flex flex-col flex-1 min-w-0">
                {/* Top content */}
                <div>
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className={`${embedded ? 'text-lg' : 'text-xl'} font-semibold text-primary`}>
                      {item.link ? (
                        <Link href={item.link} className="hover:underline">
                          {item.title}
                        </Link>
                      ) : (
                        item.title
                      )}
                    </h3>

                    {item.date && (
                      <span className="text-sm text-neutral-500 font-medium bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded whitespace-nowrap">
                        {item.date}
                      </span>
                    )}
                  </div>

                  {item.subtitle && (
                    <p className={`${embedded ? 'text-sm' : 'text-base'} text-accent font-medium mb-3`}>
                      {item.subtitle}
                    </p>
                  )}

                  {item.content && (
                    <p className={`${embedded ? 'text-sm' : 'text-base'} text-neutral-600 dark:text-neutral-500 leading-relaxed`}>
                      {item.content}
                    </p>
                  )}

                  {item.tags && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50 px-2 py-1 rounded border border-neutral-100 dark:border-neutral-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom pinned link */}
                {item.link && (
                  <div className="mt-auto pt-4">
                    <Link href={item.link} className="text-sm text-accent hover:underline">
                      {item.link_text ?? 'Read more →'}
                    </Link>
                  </div>
                )}
              </div>

              {/* IMAGE COLUMN (right aligned) */}
              {item.image && (
                <div className="md:ml-auto w-full md:w-48 flex-shrink-0">
                  <div className="aspect-video md:aspect-[4/3] relative rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-800/60">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 192px"
                      className="object-cover"
                      priority={false}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}