import type { Metadata } from 'next';
import NationalParksMap from '@/components/parks/NationalParksMap';

export const metadata: Metadata = {
  title: 'My National Parks',
  description: 'An interactive map of the U.S. national parks I have visited—and the adventures still ahead.',
  alternates: { canonical: '/national-parks/' },
};

export default function NationalParksPage() {
  return (
    <div className="parks-page playground-post-page">
      <header className="playground-post-hero">
        <p className="playground-post-kicker">Playground · Field notes</p>
        <h1 className="playground-post-title">National Park Checklist</h1>
        <p className="playground-post-intro">Eighteen parks down, forty-five landscapes still waiting. Select a park to explore the map and retrace the dates along the way.</p>
      </header>
      <NationalParksMap />
    </div>
  );
}
