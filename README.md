# kalanadidulanga.com

Portfolio site for Kalana Didulanga. Next.js App Router, statically generated,
deployed on Vercel.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **Tailwind CSS 4** + shadcn/ui (Radix primitives)
- **TypeScript 6**, ESLint 9 (flat config)
- pnpm

All content lives in [`config/`](config/) as plain TypeScript — there is no
database and no CMS. Editing a page means editing the config file for it.

## Getting started

```bash
pnpm install
cp .env.example .env.local   # fill in what you need; all vars are optional
pnpm dev
```

Open <http://localhost:3000>.

| Script | What it does |
| --- | --- |
| `pnpm dev` | Dev server |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |

## Environment variables

Every variable is optional — the site builds and runs without a `.env` file.
Features degrade individually rather than failing the build.

| Variable | Used by | If unset |
| --- | --- | --- |
| `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO` | `/api/contact` | Contact form returns 500 |
| `SB_GOOGLE_FORM_*` | `/api/sb-contact` | That endpoint returns 500 |
| `NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID` | Google Analytics | Analytics not loaded |

## Credits

Originally based on
[namanbarkiya/minimal-next-portfolio](https://github.com/namanbarkiya/minimal-next-portfolio).
