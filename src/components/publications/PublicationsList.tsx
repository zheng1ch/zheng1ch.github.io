'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  BookOpenIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { Publication } from '@/types/publication';
import { PublicationPageConfig } from '@/types/page';
import { cn } from '@/lib/utils';

interface PublicationsListProps {
  config: PublicationPageConfig;
  publications: Publication[];
  embedded?: boolean;
}

export default function PublicationsList({ config, publications, embedded = false }: PublicationsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | string | 'all'>('all');
  const [selectedType, setSelectedType] = useState<string | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedAbstractId, setExpandedAbstractId] = useState<string | null>(null);

  // Extract unique years and types for filters
  const years = useMemo(() => {
    const numericYears = Array.from(
      new Set(
        publications
          .map((p) => p.year)
          .filter((y): y is number => typeof y === 'number' && Number.isFinite(y) && y > 0)
      )
    ).sort((a, b) => b - a);

    const specialYearLabels = Array.from(
      new Set(
        publications
          .map((p) => (p.yearLabel ?? '').trim())
          .filter((lbl) => lbl.length > 0 && Number.isNaN(parseInt(lbl, 10)))
      )
    ).sort((a, b) => {
      // Always put "In review" last
      const aIsInReview = a.toLowerCase() === 'in review';
      const bIsInReview = b.toLowerCase() === 'in review';
      if (aIsInReview && !bIsInReview) return 1;
      if (!aIsInReview && bIsInReview) return -1;
      return a.localeCompare(b);
    });

    return { numericYears, specialYearLabels };
  }, [publications]);

  const types = useMemo(() => {
    const uniqueTypes = Array.from(new Set(publications.map((p) => p.type)));
    return uniqueTypes.sort();
  }, [publications]);

  // Filter publications
  const filteredPublications = useMemo(() => {
    return publications.filter((pub) => {
      const matchesSearch =
        pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pub.authors.some((author) => author.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        pub.journal?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pub.conference?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesYear =
        selectedYear === 'all'
          ? true
          : typeof selectedYear === 'number'
          ? pub.year === selectedYear
          : (pub.yearLabel ?? '').toLowerCase() === String(selectedYear).toLowerCase();

      const matchesType = selectedType === 'all' || pub.type === selectedType;

      return matchesSearch && matchesYear && matchesType;
    });
  }, [publications, searchQuery, selectedYear, selectedType]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="mb-8">
        <h1 className={`${embedded ? 'text-2xl' : 'text-4xl'} font-serif font-bold text-primary mb-4`}>
          {config.title}
        </h1>
        {config.description && (
          <p className={`${embedded ? 'text-base' : 'text-lg'} text-neutral-600 dark:text-neutral-500 max-w-2xl`}>
            {config.description}
          </p>
        )}
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search publications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center justify-center px-4 py-2 rounded-lg border transition-all duration-200',
              showFilters
                ? 'bg-accent text-white border-accent'
                : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 hover:border-accent hover:text-accent'
            )}
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-800 flex flex-wrap gap-6">
                {/* Year Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" /> Year
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {/* All */}
                    <button
                      type="button"
                      onClick={() => setSelectedYear('all')}
                      className={cn(
                        'px-3 py-1 text-xs rounded-full transition-colors',
                        selectedYear === 'all'
                          ? 'bg-accent text-white'
                          : 'bg-white dark:bg-neutral-800 text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                      )}
                    >
                      All
                    </button>

                    {/* Numeric years */}
                    {years.numericYears.map((year) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => setSelectedYear(year)}
                        className={cn(
                          'px-3 py-1 text-xs rounded-full transition-colors',
                          selectedYear === year
                            ? 'bg-accent text-white'
                            : 'bg-white dark:bg-neutral-800 text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                        )}
                      >
                        {year}
                      </button>
                    ))}

                    {/* Special labels (In review LAST) */}
                    {years.specialYearLabels.map((label) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setSelectedYear(label)}
                        className={cn(
                          'px-3 py-1 text-xs rounded-full transition-colors',
                          selectedYear === label
                            ? 'bg-accent text-white'
                            : 'bg-white dark:bg-neutral-800 text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center">
                    <BookOpenIcon className="h-4 w-4 mr-1" /> Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedType('all')}
                      className={cn(
                        'px-3 py-1 text-xs rounded-full transition-colors',
                        selectedType === 'all'
                          ? 'bg-accent text-white'
                          : 'bg-white dark:bg-neutral-800 text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                      )}
                    >
                      All
                    </button>

                    {types.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSelectedType(type)}
                        className={cn(
                          'px-3 py-1 text-xs rounded-full capitalize transition-colors',
                          selectedType === type
                            ? 'bg-accent text-white'
                            : 'bg-white dark:bg-neutral-800 text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                        )}
                      >
                        {type.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Publications List */}
      <div className="space-y-6">
        {filteredPublications.length === 0 ? (
          <div className="text-center py-12 text-neutral-500">No publications found matching your criteria.</div>
        ) : (
          filteredPublications.map((pub, index) => (
            <motion.div
              key={pub.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-all duration-200"
            >
              {/* TOP ROW: image + text */}
              <div className="flex flex-col md:flex-row md:items-stretch gap-6 w-full">
                {/* TEXT */}
                <div className="flex flex-col flex-1 min-w-0">
                  <div>
                    <h3 className={`${embedded ? 'text-lg' : 'text-xl'} font-semibold text-primary mb-2 leading-tight`}>
                      {pub.doi ? (
                        <a
                          href={`https://doi.org/${pub.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {pub.title}
                        </a>
                      ) : (
                        pub.title
                      )}
                    </h3>

                    <p className={`${embedded ? 'text-sm' : 'text-base'} text-neutral-600 dark:text-neutral-400 mb-2`}>
                      {pub.authors.map((author, idx) => (
                        <span key={idx}>
                          <span
                            className={`${author.isHighlighted ? 'font-semibold text-accent' : ''} ${
                              author.isCoAuthor
                                ? `underline underline-offset-4 ${
                                    author.isHighlighted ? 'decoration-accent' : 'decoration-neutral-400'
                                  }`
                                : ''
                            }`}
                          >
                            {author.name}
                          </span>
                          {author.isCorresponding && (
                            <sup
                              className={`ml-0 ${
                                author.isHighlighted ? 'text-accent' : 'text-neutral-600 dark:text-neutral-400'
                              }`}
                            >
                              †
                            </sup>
                          )}
                          {idx < pub.authors.length - 1 && ', '}
                        </span>
                      ))}
                    </p>

                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-600 mb-3">
                      {pub.journal || pub.conference}
                      {(pub.yearLabel || pub.year) && `, ${pub.yearLabel ?? pub.year}`}
                    </p>

                    {pub.description && (
                      <p className="text-sm text-neutral-600 dark:text-neutral-500 mb-4 line-clamp-3">{pub.description}</p>
                    )}
                  </div>

                  {/* ACTIONS pinned to bottom */}
                  <div className="mt-auto pt-4">
                    <div className="flex flex-wrap gap-2">
                      {pub.code && (
                        <a
                          href={pub.code}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white transition-colors"
                        >
                          Code
                        </a>
                      )}

                      {pub.abstract && (
                        <button
                          type="button"
                          onClick={() => setExpandedAbstractId(expandedAbstractId === pub.id ? null : pub.id)}
                          className={cn(
                            'inline-flex items-center px-3 py-1 rounded-md text-xs font-medium transition-colors',
                            expandedAbstractId === pub.id
                              ? 'bg-accent text-white'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white'
                          )}
                        >
                          <DocumentTextIcon className="h-3 w-3 mr-1.5" />
                          Abstract
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* PREVIEW (right) */}
                {pub.preview && (
                  <div className="w-full md:w-48 md:ml-auto flex-shrink-0">
                    <div className="aspect-video md:aspect-[4/3] relative rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                      <Image
                        src={`/papers/${pub.preview}`}
                        alt={pub.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 192px"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* FULL-WIDTH ABSTRACT (outside the row, so it spans the card) */}
              <AnimatePresence>
                {expandedAbstractId === pub.id && pub.abstract ? (
                  <motion.div
                    key={`abstract-${pub.id}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-6"
                  >
                    <div className="w-full bg-neutral-50 dark:bg-neutral-800 rounded-xl p-5 border border-neutral-200 dark:border-neutral-700">
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{pub.abstract}</p>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}