# Personal Blog

A modern, feature-rich personal blog built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Blog System**

  - Markdown support with code highlighting
  - Blog listing with tags and reading time
  - Responsive design for all devices

- **Project Showcase**

  - Interactive project cards
  - Tech stack visualization
  - GitHub integration

- **Steam Achievements**

  - Real-time Steam game data
  - Achievement tracking
  - Interactive timeline view

- **Internationalization**

  - Multi-language support
  - Dynamic content translation
  - MongoDB-backed translations

- **Contact System**
  - Modern contact form
  - Backend integration
  - Form validation

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.2
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.1.6
- **State Management**: Zustand 5.0.4
- **UI Components**:
  - @headlessui/react
  - @radix-ui/\*
- **Animation**:
  - Framer Motion
  - GSAP
- **Data Fetching**: SWR
- **Markdown**: react-markdown
- **Database**: MongoDB with Mongoose

## 📦 Installation

1. Clone the repository:

```bash
git clone [repository-url]
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env.local` file and add necessary environment variables:

```env
MONGODB_URI=your_mongodb_uri
STEAM_API_KEY=your_steam_api_key
STEAM_ID=your_steam_id
```

4. Start the development server:

```bash
pnpm dev
```

## 🏗️ Project Structure

```
src/
├── api/          # Web API utilities
├── app/          # Next.js app router
├── components/   # Reusable components
├── config/       # Configuration files
├── i18n/         # Internationalization
├── lib/          # Utility functions
├── models/       # MongoDB models
└── store/        # Zustand stores
```

## 🚀 Development

- **Development**: `pnpm dev`
- **Build**: `pnpm build`
- **Start**: `pnpm start`
- **Lint**: `pnpm lint`

## 🌐 API Endpoints

- `/api/blog` - Blog posts
- `/api/projects` - Projects list
- `/api/contact` - Contact form
- `/api/steam` - Steam integration
- `/api/about` - Personal profile
- `/api/i18n` - Translations
- `/api/version` - Version info

## 🎨 Theme System

The project uses a custom theme system with dark/light mode support:

- Built with next-themes
- Custom color variables
- Responsive design
- Tailwind CSS integration

## 👥 Author

Shijie Fan
Zhupi222

## Payload CMS

The site includes a self-hosted Payload CMS admin panel at `/admin`. Payload uses the same MongoDB server as the legacy content layer but writes to isolated `cms-*` collections so the source collections remain available for rollback.

Required configuration:

```env
MONGODB_URI=mongodb://localhost:27017/personal-blog
PAYLOAD_SECRET=replace-with-a-long-random-secret
```

Start the site with `pnpm dev`, open `http://localhost:3000/admin`, and create the first administrator. The CMS manages bilingual posts, projects, experiences, skills, contact details, and media. Post bodies remain Markdown so the existing public renderer continues to work.

The admin home is a content workspace with draft counts, collection summaries, recently updated entries, and shortcuts for creating posts, projects, and experiences. It follows the operating-system light or dark theme and uses the same graphite, warm-white, and muted-yellow visual language as the public site.

Post content uses an enhanced Markdown field with separate **Edit** and **Preview** modes. Preview renders GFM and fenced code blocks without changing the stored value: the database and public site still receive the same localized Markdown string.

Generate Payload types and the admin import map after changing a collection:

```bash
pnpm cms:generate
```

Run the same command after adding or moving an admin component so Payload can refresh `src/app/(payload)/admin/importMap.js`.

Preview and run the legacy MongoDB migration:

```bash
pnpm cms:migrate:dry-run
pnpm cms:migrate
pnpm cms:migrate:verify
```

The migration is idempotent and never deletes the legacy `blogs`, `projects`, `experiences`, `skills`, or `contacts` collections. Back up the database before the first production migration. Uploaded media needs persistent storage in production; configure an official Payload cloud-storage adapter when deploying to an ephemeral platform such as Vercel.
