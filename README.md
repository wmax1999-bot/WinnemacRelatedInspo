# Winnemac Properties Website (Next.js + Tailwind Starter)

Production-ready starter inspired by RelatedRentals.com. Fast to deploy on **Vercel** now, easy to migrate / mirror design to **Squarespace** later.

## ✨ Features
- Next.js 14 (App Router) + TypeScript + Tailwind
- Clean, lifestyle-forward layout (hero, search, featured properties)
- Properties grid + detail pages using local JSON data
- API routes you can later swap to ShowMojo/AppFolio
- SEO-ready metadata + responsive UI

## 🚀 Quick Start
```bash
pnpm i   # or npm i / yarn
pnpm dev # http://localhost:3000
pnpm build && pnpm start
```

> Vercel: push this folder to GitHub, create a new Vercel project, and select the repo.

## 🔄 Data
- Local seed: `data/properties.json`
- API route: `/api/properties` returns the JSON for UI
- Swap to ShowMojo later: update `app/api/showmojo/route.ts` and the data adapter in `lib/data.ts`

## 🧩 Squarespace Later
- Keep this as your **source of truth** for design/content.
- Export imagery and copy sections into Squarespace blocks.
- If you prefer code blocks in Squarespace, you can embed the **properties grid** via iframe to an API endpoint you host on Vercel.

## 🛠️ Commands
- `pnpm dev` – local dev
- `pnpm build` – production build
- `pnpm start` – run prod server

## 🔐 Environment
Copy `.env.example` to `.env.local` and fill in secrets when you wire an API source.

---

**Folder Map**
```
app/
  layout.tsx, page.tsx, globals.css
  properties/ (list + [slug] detail)
  neighborhoods/, about/, residents/, contact/
  api/properties/route.ts
  api/showmojo/route.ts   # stub for later
components/
  Header, Footer, Hero, SearchBar, PropertyCard, PropertyGrid, CTA, SectionHeader
data/
  properties.json, neighborhoods.json
lib/
  types.ts, data.ts, seo.ts
```
