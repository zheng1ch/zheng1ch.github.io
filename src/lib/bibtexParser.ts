import { Publication, PublicationType, ResearchArea } from '@/types/publication';
import { getConfig } from './config';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const bibtexParse = require('bibtex-parse-js');

const typeMapping: Record<string, PublicationType> = {
  article: 'journal',
  inproceedings: 'conference',
  conference: 'conference',
  incollection: 'book-chapter',
  book: 'book',
  phdthesis: 'thesis',
  mastersthesis: 'thesis',
  techreport: 'technical-report',
  unpublished: 'preprint',
  misc: 'preprint',
};

const monthMapping: Record<string, number> = {
  jan: 1, january: 1,
  feb: 2, february: 2,
  mar: 3, march: 3,
  apr: 4, april: 4,
  may: 5,
  jun: 6, june: 6,
  jul: 7, july: 7,
  aug: 8, august: 8,
  sep: 9, september: 9, sept: 9,
  oct: 10, october: 10,
  nov: 11, november: 11,
  dec: 12, december: 12,
};

// ---- NEW: normalize year/status label ----
function parseYear(tags: Record<string, string>): { year: number; yearLabel: string } {
  const raw = cleanBibTeXString(tags.year || '').trim();
  const numeric = parseInt(raw, 10);

  if (!Number.isNaN(numeric) && numeric > 0) {
    return { year: numeric, yearLabel: String(numeric) };
  }

  // Non-numeric year like "In review" -> do NOT map to current year
  const label =
    raw.length > 0
      ? raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase()
      : 'In review';
  return { year: 0, yearLabel: label };
}

export function parseBibTeX(bibtexContent: string): Publication[] {
  const config = getConfig();
  const authorName = config.author.name;
  const entries = bibtexParse.toJSON(bibtexContent);

  // IMPORTANT: keep file order -> NO final sort()
  return entries.map(
    (
      entry: { entryType: string; citationKey: string; entryTags: Record<string, string> },
      index: number
    ) => {
      const tags = entry.entryTags;

      const authors = parseAuthors(tags.author || '', authorName);

      const { year, yearLabel } = parseYear(tags);

      const monthStr = tags.month?.toLowerCase() || '';
      const month = monthMapping[monthStr] || (parseInt(monthStr) || undefined);

      const type = typeMapping[entry.entryType.toLowerCase()] || 'journal';

      const keywords = tags.keywords?.split(',').map((k: string) => k.trim()) || [];

      const selected = tags.selected === 'true' || tags.selected === 'yes';

      const preview = tags.preview?.replace(/[{}]/g, '');

      const publication: Publication = {
        id: entry.citationKey || tags.id || `pub-${Date.now()}-${index}`,
        title: cleanBibTeXString(tags.title || 'Untitled'),
        authors,
        year,              // still numeric for filters
        yearLabel,         // NEW: used for display ("2026" or "In review")
        month: monthMapping[tags.month?.toLowerCase()] ? String(month) : tags.month,
        type,
        status: 'published',
        tags: keywords,
        keywords,
        researchArea: detectResearchArea(tags.title, keywords),

        journal: cleanBibTeXString(tags.journal),
        conference: cleanBibTeXString(tags.booktitle),
        volume: tags.volume,
        issue: tags.number,
        pages: tags.pages,
        doi: tags.doi,
        url: tags.url,
        code: tags.code,
        abstract: cleanBibTeXString(tags.abstract),
        description: cleanBibTeXString(tags.description || tags.note),
        selected,
        preview,

        bibtex: reconstructBibTeX(entry, ['selected', 'preview', 'description', 'keywords', 'code']),
      };

      Object.keys(publication).forEach((key) => {
        if (publication[key as keyof Publication] === undefined) {
          delete publication[key as keyof Publication];
        }
      });

      return publication;
    }
  );
}

// (rest of your helpers unchanged)
function parseAuthors(authorsStr: string, highlightName?: string): Array<{ name: string; isHighlighted?: boolean; isCorresponding?: boolean; isCoAuthor?: boolean }> {
  if (!authorsStr) return [];

  return authorsStr
    .split(/\sand\s/)
    .map(author => {
      let name = author.trim();
      const isCorresponding = name.includes('*');
      const isCoAuthor = name.includes('#');
      name = name.replace(/[*#]/g, '');

      if (name.includes(',')) {
        const parts = name.split(',').map(p => p.trim());
        name = `${parts[1]} ${parts[0]}`;
      }

      let isHighlighted = false;
      if (highlightName) {
        const lowerName = name.toLowerCase();
        const lowerHighlight = highlightName.toLowerCase();
        isHighlighted = lowerName.includes(lowerHighlight);

        if (!isHighlighted && lowerHighlight.includes(' ')) {
          const parts = lowerHighlight.split(' ');
          if (parts.length === 2) {
            const reversed = `${parts[1]} ${parts[0]}`;
            isHighlighted = lowerName.includes(reversed);
          }
        }
      }

      return {
        name: cleanBibTeXString(name),
        isHighlighted,
        isCorresponding,
        isCoAuthor,
      };
    })
    .filter(author => author.name);
}

function cleanBibTeXString(str?: string): string {
  if (!str) return '';

  let cleaned = str.replace(/^["']|["']$/g, '');
  cleaned = cleaned.replace(/\{\{([^}]*)\}\}/g, '$1');

  while (cleaned.includes('{') && cleaned.includes('}')) {
    const beforeLength = cleaned.length;
    cleaned = cleaned.replace(/\{([^{}]*)\}/g, '$1');
    if (cleaned.length === beforeLength) break;
  }

  cleaned = cleaned.replace(/[{}]/g, '');
  cleaned = cleaned.replace(/\\textbf{([^}]*)}/g, '$1');
  cleaned = cleaned.replace(/\\emph{([^}]*)}/g, '$1');
  cleaned = cleaned.replace(/\\cite{[^}]*}/g, '');
  cleaned = cleaned.replace(/~/g, ' ');
  cleaned = cleaned.replace(/\\/g, '');
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned;
}

function detectResearchArea(title: string, keywords: string[]): ResearchArea {
  const text = (title + ' ' + keywords.join(' ')).toLowerCase();

  if (text.includes('healthcare') || text.includes('medical') || text.includes('health')) return 'ai-healthcare';
  if (text.includes('signal') || text.includes('processing')) return 'signal-processing';
  if (text.includes('reliability') || text.includes('fault') || text.includes('diagnosis')) return 'reliability-engineering';
  if (text.includes('quantum')) return 'quantum-computing';
  if (text.includes('neural') || text.includes('spiking')) return 'neural-networks';
  if (text.includes('transformer') || text.includes('attention')) return 'transformer-architectures';
  return 'machine-learning';
}

function reconstructBibTeX(entry: { entryType: string; citationKey: string; entryTags: Record<string, string> }, excludeFields: string[] = []): string {
  const { entryType, citationKey, entryTags } = entry;

  let bibtex = `@${entryType}{${citationKey},\n`;

  Object.entries(entryTags).forEach(([key, value]) => {
    if (!excludeFields.includes(key.toLowerCase())) {
      let cleanValue = value;
      if (key.toLowerCase() === 'author') {
        cleanValue = value.replace(/[#*]/g, '');
      }
      bibtex += `  ${key} = {${cleanValue}},\n`;
    }
  });

  bibtex = bibtex.slice(0, -2) + '\n';
  bibtex += '}';
  return bibtex;
}