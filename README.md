# Hall Bible Commentary

Aaron Joseph Hall’s original Bible commentary, articles, and sermon library. Built with Next.js App Router, TypeScript, a bundled World English Bible dataset, Supabase/PostgreSQL, and private Supabase Storage. Vercel is the production deployment target. The Sites/Vinext starter remains available as a secondary development/build integration.

## What works

- Homepage with latest published commentary, articles, and sermons; original blue/light-blue/gray design.
- Complete WEB reader: 66 books, 1,189 chapters, book/chapter navigation, verse/range selection, copy and share.
- Commentary and public sermon/article overlap lookup for the selected verse range.
- Articles search, categories, topics, Scripture, series, date filters, sorting, pagination, related reading, and share controls. Legacy `/blog` URLs redirect to `/articles`.
- Server-rendered commentary, Scripture, and archive pages, canonical metadata, Article schema, sitemap, robots, and installable PWA. The service worker caches visited Bible pages and assets, never admin/API pages or source uploads. Offline access is limited to previously visited chapters.
- Admin creates, edits, drafts, publishes, schedules, withdraws, and deletes commentary/articles. Markdown preview, taxonomy names, attribution/source links, related Scriptures, and source sermon associations are included.
- Private DOCX/PDF/TXT/Markdown uploads and pasted sermons. Text PDFs supported; scanned PDFs need OCR or pasted text. Maximum file 10 MB, extracted text 200,000 characters.
- Source-linked commentary drafts, internal paragraph provenance, edit/reassign/merge/split/reject/publish review.
- Separately publish a sermon’s metadata, description, and media links without publishing the private manuscript. Sermons participate in Bible, topic, series, global search, and related-teaching views.
- About library, About Aaron, FAQ, permissions, and speaking requests under About. Requests save to a private admin inbox; no notification emails are sent automatically.
- Resources menu with Books and TheMinistryStudy.com. Books intentionally has no invented titles.

No fabricated theological content is seeded or published.

## Local working preview

Requires Node 22.13+ (Node 22.13 includes `node:sqlite`; Node 24 is recommended).

```sh
npm ci
WATCHPACK_POLLING=true LOCAL_DEMO=true npm run dev:vercel -- --port 5180 --hostname 127.0.0.1
```

Open http://127.0.0.1:5180. Go to Writing desk → Sign in. Leave credentials blank in this **explicit local demo**. Data persists in `work/local/library.sqlite`; uploaded files persist in `work/local/uploads`. Both are excluded from Git. No source material is sent to a model without `AI_API_KEY`.

`LOCAL_DEMO` is ignored outside development. It must never be used as a production authentication mechanism. In production missing credentials fail closed. Do not expose the local demo to a network.

Local migrations are applied once and recorded in `_migrations`. The schema source is `db/schema.ts`; `npm run db:generate` adds a SQLite migration for local/Sites use. The separate PostgreSQL schema is in `supabase/schema.sql`.

## Supabase + Vercel setup

1. Create a Supabase project dedicated to this site.
2. Run `supabase/schema.sql` once in its SQL editor. It creates the application tables, indexes, row-level security, and private `sermon-uploads` bucket. This is for a **new database**, not an existing installation.
3. Create Aaron’s user in Supabase Authentication. Disable public signups if they are not needed. Copy that user’s UUID into `ADMIN_USER_ID`.
4. Add the environment variables below to the existing Vercel project `hallbiblecommentary`.
5. Use Supabase’s pooled PostgreSQL connection string for `DATABASE_URL` (transaction pooler, typically port 6543). The adapter uses TLS and disables prepared statements for pooler compatibility. Never include this value in browser-exposed variables.
6. The repository is `ajhenterprises/hallbiblecommentary`. Vercel’s Git connection already points to it. Build command: `npm run build:vercel`; output: `.next-vercel`; framework: Next.js. `vercel.json` configures these automatically.
7. Redeploy after setting credentials, then sign in at `/login` with Aaron’s Supabase email/password. An authenticated but unapproved user cannot access admin data or mutation endpoints.
8. Verify private uploads, save a draft, approve it, and confirm its verse and archive placement on the live deployment.

Server database access uses a trusted pooled PostgreSQL connection; browser roles have no direct access to application tables. `anon` and `authenticated` are denied access to manuscripts, drafts, mappings, audit records, and inbox records. Public data is selected server-side. The service-role key is only used for private storage. Back up the database and storage using Supabase before migrations or importing real material.

## Environment variables

| Variable | Purpose |
|---|---|
| `SITE_URL` | Canonical public origin, e.g. `https://hallbiblecommentary.vercel.app` |
| `DATABASE_URL` | Server-only Supabase PostgreSQL pooler connection URI |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase public/anon key used by the server auth adapter |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-only secret** for private sermon file storage |
| `ADMIN_USER_ID` | Exact UUID of Aaron’s authorized Supabase user |
| `AI_API_KEY` | Optional **server-only** OpenAI key; no AI model calls without it |
| `AI_MODEL` | Optional model name, default `gpt-4.1-mini`; choose a compatible JSON-chat model |
| `LOCAL_DEMO` | Development-only local persistence/sign-in; set `true` only on your computer |

Copy `.env.example` to `.env.local` for local settings. Never commit filled environment files. No environment value containing a secret is prefixed `NEXT_PUBLIC_`.

## Strict source mode

Strict Source Mode is always on. `lib/ai.ts` contains the provider interface, system prompt, source chunker, and output validator. The generation endpoint has no browsing/search tools, retrieval from external sources, or unrestricted provider URL.

The initial provider is deliberately **extractive**: an optional AI may select and group source chunk IDs, but the server reconstructs every paragraph from the exact source text. Arbitrary generated prose, missing IDs, duplicate IDs, and mixed-range groups are rejected. This technically prevents new model-written theological claims from entering a draft. It does not provide freeform AI paraphrasing; Aaron can edit manually in the review screen.

Without a key, a deterministic source-preserving extractor produces drafts. The UI reports this honestly. The remote provider has not been exercised without an actual key.

Use explicit section headings such as `Acts 9:1–2`, followed by the teaching for that range. The range detector proposes associations; it cannot prove a cited passage was substantively taught. Aaron must verify ranges, source ownership, meaning, and final wording before publishing. No automatic publication occurs. No output can guarantee theological correctness or authorship.

Use My Library is off by default. When enabled it includes up to 15 previously published, original commentary entries. Entries marked external or mixed are excluded. Uploaded sermons are not indiscriminately pulled into library mode. Upload only Aaron-owned manuscripts and remove or clearly separate outside quotations before generation.

Provenance retains source IDs, character spans, original excerpts, and original generated wording. Manual edits are explicitly marked as not automatically source-verified. Merge/split preserve lineage; after splitting, full original lineage is retained and the reviewer must refine the range. Private provenance is never serialized to public reader clients.

## Content and attribution

Manage branding, homepage sections, disclosure, About/FAQ/permissions copy, menu links, and book listings in Writing desk → Website settings. Defaults remain in `lib/site-defaults.ts` and `app/about-pages.tsx`. No doctrine statement, speaking availability, fees, awards, or book titles are invented. The permissions page requests written permission for reproduction; it does not copy Enduring Word’s policy or grant a blanket republication license.

Editors can mark original, mixed, or external material and add author, source title, HTTPS/HTTP link, and attribution/permission note. Use Markdown blockquotes to identify specific quoted sections in the body. Attribution does not itself establish permission.

Taxonomies are stored on content records and searchable by index pages. A separate taxonomy table supplies consistent editor suggestions. Blog is retained only as the internal content kind for compatibility; the public label and URLs are Articles.

## Bible data

Bundled WEB JSON is derived from https://github.com/TehShrike/world-english-bible, which references https://ebible.org/web/. The WEB text is public domain. See https://ftp.ebible.org/eng-web/copyright.htm. This edition has 31,103 verse records; counts follow source markers, not a harmonized count across translations. Poetry/paragraph fragments are combined by chapter and verse without rewriting text. Only the active chapter reaches the browser; text search runs server-side over the dataset. Bible pages are not seeded into a second paid database.

## Verification

```sh
npm run build:vercel
npx tsc --noEmit
```

The initial local integration checks exercise unauthorized and cross-origin rejection, admin sign-in, sermon paste, source-only draft segmentation, provenance, publication, related verse lookup, article attribution, public search, invalid range rejection, and test-record cleanup. Extended checks for uploads, metadata-only public sermons, inquiries, article filters, and public route responses have not yet run; automatic approval review blocked that test run. External Supabase and AI credentials still require live integration verification.

## Practical limits

- Live content/auth/uploads/inquiries require Supabase settings; the public Bible and informational pages work without them.
- Email notifications, OCR, newsletter delivery, and a book sales catalog are not configured.
- Article inline Markdown images support existing HTTPS images; there is no public image-upload library yet.
- Source review is conservative and extractive, not unconstrained AI rewriting.
- Large catalog search currently filters server-side records; a larger collection should move to PostgreSQL full-text search and paginated repository queries.
- Basic request throttling limits repeated submissions by email; add deployment-level rate limiting or CAPTCHA before significant public traffic.
- iOS installation requires Safari → Share → Add to Home Screen. Device-specific PWA and native share behavior should be confirmed on a real iPhone.

## Categories and SEO controls

Writing desk → Categories & tags lists categories, topics, people, and series, including labels entered directly on teaching. Rename propagates to linked records; delete removes the label while preserving the content. Existing open entry editors must reload after a rename.

Writing desk → SEO settings controls any public page path, including the homepage, archives and About pages. Saved commentary/articles and sermon details also have SEO panels. SEO saves separately from content; blank values use defaults. Set search title, description, HTTPS social image and noindex. Canonical URLs remain stable and automatic. Noindex pages are excluded from the sitemap but remain publicly accessible. These settings are stored in the existing site_settings table; no database migration is needed.
