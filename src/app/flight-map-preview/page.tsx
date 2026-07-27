import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import FlightMap from '@/components/flights/FlightMap';
import { parseFlightyCsv } from '@/lib/flightMap';

export const metadata: Metadata = { title: 'Interactive flight map preview', description: 'An interactive map of my flight history.' };

export default function FlightMapPreviewPage() {
  const csv = fs.readFileSync(path.join(process.cwd(),'content','flighty-export.csv'),'utf8');
  const flights = parseFlightyCsv(csv);
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
    <header className="mb-8">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-3">Playground · Preview</div>
      <h1 className="text-4xl lg:text-5xl font-serif font-bold text-primary">My flight map</h1>
      <p className="mt-3 max-w-2xl text-neutral-600 dark:text-neutral-500">An interactive record of the places, routes, and aircraft that have carried me around the world.</p>
    </header>
    <FlightMap flights={flights}/>
  </div>;
}
