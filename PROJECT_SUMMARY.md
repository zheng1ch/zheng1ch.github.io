# Project Summary

> This is the authoritative project-level source of truth for Yicheng Zheng's personal academic website. It captures the product direction, architecture, design philosophy, current capabilities, roadmap, and deliberate exclusions. Update it in the same change whenever any of those areas change.

Last reviewed: August 1, 2026

## Recent Changes

Newest first. This is a short handoff log, not a replacement for Git history.

### 2026-08-08

- Aligned canonical URLs, robots guidance, and the public sitemap with the `yichengzheng.com` production domain.

### 2026-08-01

- Updated profile and travel visuals, then aligned route flags and labels.
- Added this project summary and refreshed the sitemap with the National Park Checklist.

### 2026-07-30

- Restored theme-aware profile icons.

### 2026-07-29

- Added the National Park Checklist, interactive park map, visit tracking, and personal photo galleries.
- Refined map interactions and aligned the Playground and flight-statistics layouts.
- Updated the profile assets, social icons, favicon, and site layout.
- Improved flight rankings and shortened aircraft labels.

### 2026-07-27

- Replaced the legacy flights content page with a dedicated Google Maps flight-history experience.
- Added theme-aware flight maps, route flags, production configuration, and ranking refinements.
- Kept the flights experience under Playground instead of exposing Travel in primary navigation.

## What This Project Is

This project is Yicheng Zheng's personal academic website. Its first responsibility is to present research identity and scholarly work clearly; its second is to provide a small, intentionally informal playground for personal data stories and interactive travel records.

The website was initially built from the PRISM academic-website template.

The site is designed to be statically exported and easy to maintain through content files rather than a database or admin system.

## Current Features

### Academic profile

- Responsive profile page with biography, research interests, contact details, institutional information, and links to Google Scholar, ORCID, GitHub, and LinkedIn.
- Publications sourced from BibTeX, including a selected-publications view on the home page and a complete publications page.
- Markdown-driven CV and posters pages.
- Reusable TOML-configured text, publication, and card page types.
- Page metadata, favicon, footer update date, and static route generation.

### Site experience

- Separate-page navigation on desktop and mobile, with support for—but current rejection of—a one-page layout.
- Light, dark, and system theme preferences, including theme-aware interactive maps.
- Responsive layouts, reduced-motion handling in the major interactive experiences, and stable heading anchors with an on-page table of contents for longer Markdown pages.
- Static production export with trailing-slash routes and unoptimized local images, suitable for static hosting.

### Playground

- A card-based playground index that keeps personal experiments distinct from the academic core.
- **Flights record:** parses a local Flighty CSV into an interactive Google Map with route and airport search, year filtering, map styles, distance-unit switching, summary statistics, rankings, and time-based charts.
- **National Park Checklist:** maps all 63 U.S. national parks, tracks visited and unvisited parks, supports filtering and sorting, and connects visited parks to personal photo galleries.
- **Mood tracking 2025:** a long-form, Markdown-based personal-data story with its own playground presentation.
- Additional experiments such as the visitors map remain accessible only when explicitly linked and are not part of primary navigation.

## Design Philosophy

1. **Academic purpose first.** The homepage and primary navigation should make the research profile legible before showcasing side projects.
2. **Personal, but restrained.** Travel photography, flight history, and self-tracking can have character; they live under Playground so they do not compete with scholarly content.
3. **Content should be easy to change.** Biographical copy, publications, page definitions, and navigation belong in Markdown, BibTeX, TOML, or source data whenever practical.
4. **Interactive pages should tell a story.** Maps are paired with progress, rankings, dates, or photographs instead of existing as decoration.
5. **Visual consistency over generic templates.** Shared typography, spacing, color tokens, panels, motion, and theme behavior should make custom experiences feel like one site.
6. **Progressive enhancement and accessibility matter.** Interfaces should remain responsive, respect reduced-motion preferences, use meaningful labels, and expose useful content around third-party visualizations.
7. **Prefer a small static system.** Avoid infrastructure that adds operational work without improving the visitor experience or the author's editing workflow.

## Tech Stack

| Area | Current choice |
| --- | --- |
| Framework | Next.js 15 App Router, React 19, TypeScript |
| Styling | Tailwind CSS 4 plus site-wide custom CSS variables and component classes |
| Content | TOML, Markdown, BibTeX, and CSV files under `content/` |
| Content rendering | `react-markdown`, `rehype-raw`, custom stable heading slugs |
| Motion and UI | Framer Motion, Headless UI, Lucide, Heroicons, and Tabler icons |
| State | React state plus Zustand for persisted theme preference |
| Maps | Google Maps JavaScript API for flights; D3 Geo, TopoJSON, and `us-atlas` for national parks |
| Build and hosting model | Node.js 22+, static Next.js export in production |

There is no application database, CMS, authentication layer, or server-side API. Most data is committed with the site; the flight map is the notable exception that loads Google Maps in the browser and requires `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.

## Roadmap

This is a maintenance-oriented roadmap, not a promise of dates.

### Now

- Keep biography, CV, posters, publications, social links, visit dates, flight data, and the displayed `last_updated` value current.
- Add national-park photographs and trip metadata as visits occur, while keeping source data and displayed totals aligned.
- Preserve production static-export compatibility and verify responsive light/dark behavior when changing shared layouts.

### Next

- Improve accessibility and keyboard behavior across map controls, dialogs, galleries, charts, and mobile navigation.
- Audit the large personal-photo collection for web-sized formats, loading performance, and consistent alt text.
- Consolidate duplicated playground presentation patterns and retire development-only or legacy routes when they no longer serve testing.
- Add lightweight automated checks for content parsing, static route generation, and the core production build.

### Later, only when there is real content

- Enable Awards, Services, Teaching, or News sections after replacing placeholder material with maintained content.
- Promote hidden experiments into navigation only when they are polished, useful, and consistent with the site's academic-first hierarchy.
- Add new playground projects when they communicate a genuine personal dataset or story—not simply to increase the project count.

## Things Intentionally Rejected or Deferred

These are current decisions, not permanent prohibitions. Revisit them only with a concrete reason, and update this section when doing so.

- **A single scrolling page for the whole site.** The code supports it, but `enable_one_page_mode` is intentionally off; distinct routes make publications, posters, CV, and Playground easier to navigate and share.
- **Likes or engagement mechanics.** The supported like feature is disabled. This is a personal academic site, not a social platform.
- **Putting every experiment in primary navigation.** Flights, the visitors map, and mood tracking use hidden or Playground-mediated routes to protect a concise top-level hierarchy.
- **A top-level Travel page that bypasses Playground.** The dedicated flights experience remains implemented, but its old generic content route is excluded so it cannot override the interactive map.
- **Publishing placeholder professional sections.** Awards and Services navigation, and the home-page News feed, remain commented out while their content is incomplete or illustrative. Teaching also exists as a page schema/example rather than a promoted section.
- **A CMS, database, accounts, or backend service.** Committed files and static generation are sufficient for the current single-author workflow.
- **A generic map or dashboard aesthetic disconnected from the site.** Recent work has favored theme-aware maps, consistent panels, local flag assets, personal photography, and editorial framing.
- **Treating Playground as a miscellaneous feature dump.** Side projects need a clear personal story or dataset and should remain visually integrated with the rest of the website.

## Keeping This File Current

For every meaningful project change:

1. Add a brief entry to **Recent Changes**; keep only the recent history useful for handoffs and rely on Git for the full record.
2. Update **Current Features** when visitor-visible behavior ships or is removed.
3. Update **Tech Stack** when a dependency, data source, hosting assumption, or architectural boundary changes.
4. Move roadmap items as work progresses; do not leave completed work described as future work.
5. Record important product or architecture decisions in **Things Intentionally Rejected or Deferred**, including what replaced the rejected approach.
6. Refresh the review date and make statements match the repository at that commit.

When this summary and the implementation disagree, inspect the current code, `content/config.toml`, and recent Git history, then correct this file as part of the same change.

Small copy edits and data refreshes do not require a summary change unless they alter the product direction or invalidate a statement above.
