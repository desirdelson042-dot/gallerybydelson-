# gallerybydelson

A fully CMS-driven personal portfolio site. Every part of the public site — Hero, About, Work, Services, Experience, Blog, My Live, Contact, Footer, and section order/visibility — is editable from `/admin`, backed by Supabase. No code changes are needed for day-to-day content updates.

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind v4)
- **Supabase** — Postgres database with Row Level Security, Auth, and Storage (media library)
- Deployed on **Vercel**

## Local development

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project URL + anon key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site.

## First-time admin setup

1. Visit `/admin/setup` (redirects there automatically from `/admin/login` if no admin account exists yet).
2. Create your email + password. This is a one-time step — the first account created becomes the site's sole admin (enforced server-side via a Postgres function, `claim_admin()`, which refuses to run again once an admin exists).
3. If your Supabase project requires email confirmation, confirm your email, then sign in at `/admin/login` — your account is promoted to admin automatically on first successful login.
4. From then on, manage everything at `/admin`.

## How content visibility works

- **Draft / Published**: Projects and Blog posts have an explicit draft/published status. Draft content is only visible to a signed-in admin (enforced by Supabase RLS) — public visitors only ever see published content.
- **Section show/hide**: Homepage sections (Hero, Work, About, Services, Experience, Blog, My Live, Contact, plus any custom sections you add) can be toggled on/off and reordered by drag-and-drop from `/admin/sections`, independent of draft/publish state.
- **Live preview**: While signed in as admin, visiting the public site shows a "Preview mode" banner and reveals draft content and hidden sections, so you can review changes before they go live to everyone else.

## Environment variables

See `.env.example`. Required:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Deploying

Push to your connected Git branch and deploy on [Vercel](https://vercel.com/new), setting the same environment variables in the project's settings. Point your custom domain at the Vercel deployment.
