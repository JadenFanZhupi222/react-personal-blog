# Home Project Carousel Implementation Plan

**Goal:** Replace the rejected homepage project/blog cards with a manually controlled three-project showcase and a separate latest-writing list, while removing sensitive product naming from public project data.

**Architecture:** The server page prepares locale-specific project and article arrays. A client-side Swiper component owns carousel state and accessible controls; dedicated artwork renders editorial product abstractions instead of screenshots. Database records are backed up before sanitization.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Swiper, MongoDB/Mongoose, Vitest.

---

### Task 1: Define the homepage content contract

- Update `src/components/home/types.ts` for project and article arrays.
- Update the homepage source test first and confirm it fails.
- Select three non-personal projects and three latest articles in the server page.

### Task 2: Build the project showcase

- Add `HomeProjectCarousel.tsx` with manual previous/next controls, keyboard support, counter, and no autoplay.
- Add `ProjectArtwork.tsx` with distinct, non-sensitive artwork for the photo booth, meal planner, and date picker.
- Integrate the showcase into `src/components/home/index.tsx`.

### Task 3: Separate latest writing

- Add `LatestWriting.tsx` as a compact editorial list below the carousel.
- Add typed Chinese and English interface copy.
- Remove the obsolete homepage `FeatureCard` implementation.

### Task 4: Sanitize project content

- Back up matching project documents to `content_backups`.
- Rename the photo-booth project in both locales, remove private names/package references, and clear the private repository URL.
- Query the updated records to verify sensitive terms are absent.

### Task 5: Verify and preview

- Run focused tests, full tests, typecheck, lint, and production build.
- Inspect desktop and mobile layouts in the in-app browser.
- Restart the feature preview on port 3011 and leave the finished homepage open.
