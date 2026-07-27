import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import FlightMap from '@/components/flights/FlightMap';
import { parseFlightyCsv } from '@/lib/flightMap';

export const metadata: Metadata = {
  title: 'My flights record',
  description: 'An interactive map and statistical record of my flight history.',
};

export default function FlightsPage() {
  const csv = fs.readFileSync(path.join(process.cwd(), 'content', 'flighty-export.csv'), 'utf8');
  const flights = parseFlightyCsv(csv);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
      <header className="mb-8">
        <h1 className="text-4xl lg:text-5xl font-serif font-bold text-primary">My flights record</h1>
        <p className="mt-3 text-neutral-600 dark:text-neutral-500">
          An interactive record of the places, routes, and aircraft that have carried me around the world.
        </p>
      </header>

      <FlightMap flights={flights} />

      <footer className="mt-8 border-t border-neutral-200 pt-6 text-sm text-neutral-500 dark:border-neutral-800">
        My flights are also recorded on{' '}
        <a
          href="https://my.flightradar24.com/zhengych"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-accent hover:underline"
        >
          MyFlightRadar24
        </a>
        .
      </footer>
    </div>
  );
}
