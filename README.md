# Pleep Docs

Documentation site for [Pleep](https://pleep.app) — AI sales assistants platform.

Built with [Fumadocs](https://fumadocs.vercel.app), [Next.js](https://nextjs.org), and [Tina CMS](https://tina.io).

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── [lang]/            # Language-based routing (ru, en, kk)
│   └── layout.tsx         # Root layout
├── content/
│   └── docs/              # MDX documentation files
│       ├── *.ru.mdx       # Russian (default)
│       ├── *.en.mdx       # English
│       └── *.kk.mdx       # Kazakh
├── lib/
│   ├── i18n.ts            # i18n configuration
│   └── source.ts          # Fumadocs source loader
├── tina/
│   └── config.ts          # Tina CMS configuration
└── source.config.ts       # Fumadocs MDX config
```

## Languages

- **Russian (ru)** — default language
- **English (en)**
- **Kazakh (kk)**

## Tina CMS

To enable visual editing:

1. Create a project at [tina.io](https://tina.io)
2. Connect your GitHub repository
3. Add `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN` to your environment variables
4. Access the editor at `/admin`

## Deployment

Deploy to [Vercel](https://vercel.com):

1. Connect the GitHub repository to Vercel
2. Set the custom domain to `docs.pleep.app`
3. Add environment variables for Tina CMS
4. Deploy

## Team

For content editing, use Tina CMS at `/admin` — no technical knowledge required.
