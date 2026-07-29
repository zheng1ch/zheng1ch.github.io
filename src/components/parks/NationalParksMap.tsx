'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { ArrowDownUp, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, MapPin, TreePine, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { geoAlbersUsa, geoPath } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
import usStates from 'us-atlas/states-10m.json';
import { NATIONAL_PARKS, NationalPark } from '@/lib/nationalParks';

type Filter = 'all' | 'visited' | 'unvisited';
type Sort = 'name' | 'recent' | 'earliest' | 'state' | 'status';
type LibraryItem = { park: NationalPark; photo: string; index: number };

const SORT_LABELS: Record<Sort, string> = {
  name: 'Name A–Z', recent: 'Most recent', earliest: 'First visited', state: 'State', status: 'Visit status',
};

const STATE_ABBREVIATIONS: Record<string, string> = {
  'Maine':'ME','Utah':'UT','South Dakota':'SD','Texas':'TX','Florida':'FL','Colorado':'CO',
  'California / Nevada':'CA/NV','Alaska':'AK','Missouri':'MO','Montana':'MT','Arizona':'AZ',
  'Wyoming':'WY','Nevada':'NV','North Carolina / Tennessee':'NC/TN','Hawaiʻi':'HI','Arkansas':'AR',
  'Indiana':'IN','Michigan':'MI','California':'CA','Kentucky':'KY','American Samoa':'AS',
  'West Virginia':'WV','Ohio':'OH','Virginia':'VA','North Dakota':'ND','U.S. Virgin Islands':'VI',
  'Minnesota':'MN','New Mexico':'NM','Wyoming / Montana / Idaho':'WY/MT/ID','Oregon':'OR','Washington':'WA',
  'South Carolina':'SC',
};

const MAP_WIDTH = 960;
const MAP_HEIGHT = 520;
const projection = geoAlbersUsa();
const atlas = usStates as unknown as { objects: { nation: object; states: object } };
const nationPath = geoPath(projection)(feature(usStates as never, atlas.objects.nation as never) as never) ?? '';
const statesPath = geoPath(projection)(mesh(usStates as never, atlas.objects.states as never, (a, b) => a !== b) as never) ?? '';

function markerPosition(park: NationalPark) {
  if (park.id === 'npsa') return { left: `${45 / MAP_WIDTH * 100}%`, top: `${498 / MAP_HEIGHT * 100}%` };
  if (park.id === 'viis') return { left: `${915 / MAP_WIDTH * 100}%`, top: `${498 / MAP_HEIGHT * 100}%` };
  const point = projection([park.lng, park.lat]);
  if (!point) return { left: '50%', top: '50%' };
  return { left: `${(point[0] / MAP_WIDTH * 100).toFixed(4)}%`, top: `${(point[1] / MAP_HEIGHT * 100).toFixed(4)}%` };
}

function prettyDate(date?: string) {
  if (!date) return 'Not visited yet';
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`));
}

function shuffleScore(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export default function NationalParksMap() {
  const [selected, setSelected] = useState<string | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [photoDirection, setPhotoDirection] = useState<-1 | 1>(1);
  const [isPhotoNavigation, setIsPhotoNavigation] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('name');
  const [sortOpen, setSortOpen] = useState(false);
  const [directoryOpen, setDirectoryOpen] = useState(true);
  const sortRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const closeSort = (event: PointerEvent) => {
      if (!sortRef.current?.contains(event.target as Node)) setSortOpen(false);
    };
    document.addEventListener('pointerdown', closeSort);
    return () => document.removeEventListener('pointerdown', closeSort);
  }, []);
  const selectedPark = selected ? NATIONAL_PARKS.find(park => park.id === selected) ?? null : null;
  const visible = useMemo(() => {
    const parks = NATIONAL_PARKS.filter(park => filter === 'all' || (filter === 'visited' ? park.visited : !park.visited));
    return [...parks].sort((a, b) => {
      if (sort === 'state') return a.state.localeCompare(b.state) || a.name.localeCompare(b.name);
      if (sort === 'status') return Number(Boolean(b.visited)) - Number(Boolean(a.visited)) || a.name.localeCompare(b.name);
      if (sort === 'recent') return (b.visited ?? '').localeCompare(a.visited ?? '') || a.name.localeCompare(b.name);
      if (sort === 'earliest') return (a.visited ? 0 : 1) - (b.visited ? 0 : 1) || (a.visited ?? '').localeCompare(b.visited ?? '') || a.name.localeCompare(b.name);
      return a.name.localeCompare(b.name);
    });
  }, [filter, sort]);
  const visited = NATIONAL_PARKS.filter(park => park.visited).length;
  const reduceMotion = useReducedMotion();
  const openPark = (id: string) => { setIsPhotoNavigation(false); setSelected(id); setPhotoIndex(0); };
  const selectedPhotos = selectedPark?.photos ?? [];
  const focusedGallery = Boolean(selectedPark?.visited && selectedPhotos.length > 0);
  const galleryCategory = focusedGallery ? 'visited' : selectedPark ? (selectedPark.visited ? 'visited' : 'unvisited') : 'blank';
  const photoLibrary = useMemo(() => NATIONAL_PARKS.flatMap<LibraryItem>(park => {
    const photos = park.photos ?? [];
    return photos.map((photo, index) => ({ park, photo, index }));
  }).sort((a, b) => shuffleScore(a.photo) - shuffleScore(b.photo)), []);
  const stepPhoto = (direction: -1 | 1) => {
    setIsPhotoNavigation(true);
    setPhotoDirection(direction);
    setPhotoIndex(index => (index + direction + selectedPhotos.length) % selectedPhotos.length);
  };
  const storyIndexes = selectedPhotos.length > 2
    ? [(photoIndex - 1 + selectedPhotos.length) % selectedPhotos.length, photoIndex, (photoIndex + 1) % selectedPhotos.length]
    : selectedPhotos.length === 2
      ? [(photoIndex + 1) % 2, photoIndex]
      : [photoIndex];

  return (
    <div className="parks-explorer">
      <div className="parks-toolbar">
        <div className="parks-progress" aria-label={`${visited} of ${NATIONAL_PARKS.length} parks visited`}>
          <strong>{visited}</strong><span> / {NATIONAL_PARKS.length} parks</span>
          <div><i style={{ width: `${visited / NATIONAL_PARKS.length * 100}%` }} /></div>
        </div>
        <div className="parks-filters" aria-label="Filter parks">
          {(['all', 'visited', 'unvisited'] as Filter[]).map(value => (
            <button key={value} type="button" onClick={() => setFilter(value)} aria-pressed={filter === value}>
              {value === 'all' ? 'All parks' : value === 'visited' ? 'Visited' : 'Still to go'}
            </button>
          ))}
        </div>
      </div>

      <div className="parks-map-shell" onClick={() => setSelected(null)}>
        <div className="parks-map" aria-label="Interactive map of United States national parks">
          <svg className="parks-basemap" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} preserveAspectRatio="none" role="img" aria-label="Map of the United States">
            <path className="parks-nation" d={nationPath} />
            <path className="parks-state-lines" d={statesPath} />
          </svg>
          {visible.map(park => {
            const isVisited = Boolean(park.visited);
            return (
              <button
                key={park.id}
                type="button"
                className={`park-marker ${isVisited ? 'is-visited' : 'is-unvisited'} ${selected === park.id ? 'is-selected' : ''}`}
                style={markerPosition(park)}
                onClick={(event: MouseEvent<HTMLButtonElement>) => { event.stopPropagation(); openPark(park.id); }}
                aria-label={`${park.name}, ${isVisited ? `visited ${prettyDate(park.visited)}` : 'not visited'}`}
                title={park.name}
              >
                <TreePine aria-hidden="true" />
              </button>
            );
          })}
          <span className="territory-label territory-label-left">American Samoa</span>
          <span className="territory-label territory-label-right">U.S. Virgin Islands</span>
        </div>

        <AnimatePresence mode="sync">
        {selectedPark && (
          <motion.aside
            key={selectedPark.id}
            className="park-detail park-detail-compact"
            aria-live="polite"
            onClick={event => event.stopPropagation()}
            initial={reduceMotion ? false : { opacity: 0, y: 16, scale: .94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: .97 }}
            transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 360, damping: 28, mass: .72 }}
          >
            <div>
              <button className="park-detail-close" type="button" onClick={() => setSelected(null)} aria-label="Close park details"><X size={17} /></button>
              <span className={`visit-status ${selectedPark.visited ? 'is-visited' : ''}`}>
                {selectedPark.visited ? <><Check size={14}/> Visited</> : <><MapPin size={14}/> Still to go</>}
              </span>
              <h2>{selectedPark.name}</h2>
              <p>{selectedPark.state}</p>
              <p className="park-date"><CalendarDays size={16}/>{prettyDate(selectedPark.visited)}</p>
            </div>
          </motion.aside>
        )}
        </AnimatePresence>
      </div>

      {photoLibrary.length > 0 && (
        <section className="park-gallery-frame" aria-label="National park photo gallery">
          <AnimatePresence mode="wait" initial={false}>
            <motion.header
              key={galleryCategory}
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
              transition={{ duration: reduceMotion ? 0 : .16, ease: 'easeOut' }}
            >
              {focusedGallery && selectedPark ? (
                <><div><span>Trip photos</span><h2>{selectedPark.name}</h2></div><p>{selectedPark.state} · {prettyDate(selectedPark.visited)}</p></>
              ) : selectedPark?.visited ? (
                <><div><span>Visited · Archive note</span><h2>A few frames wandered off</h2></div><p>The trip remains, even if the photographs took another path.</p></>
              ) : selectedPark ? (
                <><div><span>Oops—not there yet</span><h2>This story is still unwritten</h2></div><p>For now, wander through the places I&apos;ve already been.</p></>
              ) : (
                <><div><span>Photo collection</span><h2>Park stories</h2></div><p>Select a photograph to revisit the trip.</p></>
              )}
            </motion.header>
          </AnimatePresence>
          <div className={`park-library-viewport ${focusedGallery ? 'is-hidden' : ''}`} aria-hidden={focusedGallery}>
            <div className="park-library-track">
              {[0, 1].map(copy => (
                <div className="park-library-shelf" key={copy} aria-hidden={copy === 1}>
                  {photoLibrary.map(({ park, photo, index }, position) => (
                    <motion.button
                      key={`${copy}-${park.id}-${photo ?? 'memory'}-${index}`}
                      type="button"
                      className={`park-library-card card-${position % 7} ${position % 19 === 8 ? 'is-feature' : ''}`}
                      onClick={() => { openPark(park.id); setPhotoIndex(index); }}
                      whileHover={reduceMotion ? undefined : { y: -7, scale: 1.035 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                      aria-label={`Open photo ${index + 1} from ${park.name}`}
                      tabIndex={copy === 1 || focusedGallery ? -1 : 0}
                    >
                      <img loading="lazy" decoding="async" src={photo} alt={`Personal photo from ${park.name} National Park`} />
                    </motion.button>
                  ))}
                </div>
              ))}
            </div>
          </div>

      {selectedPark && selectedPhotos.length > 0 && (
        <div className="park-focused-content" aria-label={`${selectedPark.name} photo gallery`}>
          <div className="park-story-progress" aria-label={`Photo ${photoIndex + 1} of ${selectedPhotos.length}`}>
            {selectedPhotos.map((photo, index) => <i key={photo} className={index <= photoIndex ? 'is-complete' : ''} />)}
          </div>
          <div className="park-story-deck">
            {storyIndexes.length > 1 && (
              <button className="park-story-arrow is-left" type="button" onClick={() => stepPhoto(-1)} aria-label="Show previous photo">
                <ChevronLeft size={22} />
              </button>
            )}
            <AnimatePresence initial={false} mode="popLayout">
              {storyIndexes.map((index, slot) => {
                const isCurrent = slot === (storyIndexes.length === 1 ? 0 : 1);
                const isPrevious = storyIndexes.length > 1 && slot === 0;
                return (
                  <motion.button
                    layout={isPhotoNavigation}
                    key={selectedPhotos[index]}
                    type="button"
                    className={`park-story-card ${isCurrent ? 'is-current' : 'is-side'} ${isPrevious ? 'is-previous' : 'is-next'}`}
                    style={{ gridColumn: storyIndexes.length === 1 ? 1 : slot === 0 ? 1 : slot === 1 ? 3 : 5 }}
                    initial={reduceMotion || !isPhotoNavigation ? false : { opacity: 0, x: photoDirection * 90, scale: .94 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={reduceMotion || !isPhotoNavigation ? { opacity: 0 } : { opacity: 0, x: photoDirection * -90, scale: .94 }}
                    onClick={() => !isCurrent && stepPhoto(isPrevious ? -1 : 1)}
                    aria-label={isCurrent ? `Current photo ${index + 1}` : isPrevious ? 'Show previous photo' : 'Show next photo'}
                    transition={reduceMotion || !isPhotoNavigation ? { duration: 0 } : { layout: { type: 'spring', stiffness: 260, damping: 30, mass: .85 }, opacity: { duration: .2 }, x: { type: 'spring', stiffness: 260, damping: 30 }, scale: { duration: .28 } }}
                  >
                    <img src={selectedPhotos[index]} alt={isCurrent ? `Personal photo ${index + 1} from ${selectedPark.name} National Park` : ''} />
                    {isCurrent && <span>{photoIndex + 1} / {selectedPhotos.length}</span>}
                  </motion.button>
                );
              })}
            </AnimatePresence>
            {storyIndexes.length > 1 && (
              <button className="park-story-arrow is-right" type="button" onClick={() => stepPhoto(1)} aria-label="Show next photo">
                <ChevronRight size={22} />
              </button>
            )}
          </div>
        </div>
      )}
        </section>
      )}

      <section className={`parks-directory ${directoryOpen ? '' : 'is-collapsed'}`}>
        <div className="parks-section-heading">
          <button className="parks-directory-toggle" type="button" onClick={() => setDirectoryOpen(open => !open)} aria-expanded={directoryOpen}>
            <span className="parks-directory-chevron"><ChevronDown size={17}/></span>
            <h2>Park directory</h2>
            <small>{visible.length} parks</small>
          </button>
          {directoryOpen && <div className="parks-sort" ref={sortRef}>
            <button className="parks-sort-trigger" type="button" onClick={() => setSortOpen(open => !open)} aria-expanded={sortOpen} aria-haspopup="menu">
              <ArrowDownUp size={14}/><span>Sort</span><strong>{SORT_LABELS[sort]}</strong><ChevronDown size={14}/>
            </button>
            {sortOpen && <div role="menu" aria-label="Sort parks">
              {(Object.keys(SORT_LABELS) as Sort[]).map(value => (
                <button key={value} type="button" role="menuitemradio" aria-checked={sort === value} onClick={() => {
                  setSort(value);
                  setSortOpen(false);
                }}>
                  <span>{SORT_LABELS[value]}</span>{sort === value && <Check size={14}/>} 
                </button>
              ))}
            </div>}
          </div>}
        </div>
        <AnimatePresence initial={false}>
        {directoryOpen && <motion.div className="parks-grid" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduceMotion ? 0 : .3 }}>
          {visible.map(park => (
            <button key={park.id} type="button" className={park.visited ? 'visited' : ''} onClick={() => { openPark(park.id); window.scrollTo({ top: 180, behavior: 'smooth' }); }}>
              <TreePine className="park-list-tree" aria-hidden="true" />
              <span><strong>{park.name} <em>{STATE_ABBREVIATIONS[park.state] ?? park.state}</em></strong><small>{park.visited ? prettyDate(park.visited) : 'Not visited yet'}</small></span>
              {park.visited && <Check size={16} />}
            </button>
          ))}
        </motion.div>}
        </AnimatePresence>
      </section>
    </div>
  );
}
