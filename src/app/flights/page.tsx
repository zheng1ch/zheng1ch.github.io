import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import FlightMap from '@/components/flights/FlightMap';
import { parseFlightyCsv } from '@/lib/flightMap';

export const metadata: Metadata = {
  title: 'My flights record',
  description: 'An interactive map and statistical record of my flight history.',
  alternates: { canonical: '/flights/' },
};

export default function FlightsPage() {
  const csv = fs.readFileSync(path.join(process.cwd(), 'content', 'flighty-export.csv'), 'utf8');
  const flights = parseFlightyCsv(csv);

  return (
    <div className="playground-post-page">
      <header className="playground-post-hero">
        <p className="playground-post-kicker">Playground · Flight log</p>
        <h1 className="playground-post-title">Flights record</h1>
        <p className="playground-post-intro">
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
