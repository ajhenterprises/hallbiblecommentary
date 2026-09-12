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

## Rich editor, policies, and verified source library

The admin editor uses Tiptap, matching The Ministry Study's core formatting tools: headings, bold/italic/underline/strike/highlight, lists/checklists, quotation, divider, alignment, links, image upload or URL, Scripture insertion, and library insertion. It adds tables, full-screen writing, HTML/text export, preview/source editing, and body recovery history. Existing Markdown remains readable. Rich content carries `<!--hall-rich-->` and is sanitized at save and render. Uploaded images remain private until referenced by published content. YouTube players load only after the reader chooses to load them.

The footer includes Aaron's copyright, Privacy, Terms, Content Policy, Cookie Notice, and a reopenable disclaimer. Policy text can be overridden in Website Settings → Pages. Review the operator contact and published policies whenever actual data practices change.

### Source Library workflow

1. Upload a manuscript in Sermons or publish an original article/commentary. Source Library indexes these existing records; it never fetches external links.
2. Review each segment. All unverified prose defaults to unknown. Quotations, links, citation cues and embedded material are flagged; automated detection is advisory, never proof of authorship.
3. Manually classify only words you have verified as original. A segment containing a source warning requires a written explanation before it may be marked original. Assign its Scripture passage and whether it is substantial teaching, supporting Scripture, or a passing mention.
4. Develop commentary from verified substantial teaching. Priority is approved commentary, sermons, articles, other verified writing. Source-preserving mode accepts only supplied source indices from the model, not invented prose. Without an AI key it uses deterministic source ordering. It deliberately does not provide unconstrained AI rewriting.
5. Review the proposal, source excerpts, and changes. Save edits, acknowledge source/theology review, then explicitly Approve & Publish. Proposed updates remain separate from the current public record. Changed/reclassified sources or a changed live revision invalidate approval.
6. Published history is append-only; rollback publishes a previous body as a new version. SEO/tag-only changes do not advance the substantive last-updated date. Saving a draft revision of a published commentary creates a proposal while its live body remains unchanged.

The private voice profile is a versioned reference profile of manually verified original segments, with separate sermon/article/commentary vocabulary, sentence-length measures and examples. It is not fine-tuning, does not infer unexpressed beliefs, and never automatically treats quoted text as Aaron-authored. Manual authorship verification remains essential: software cannot reliably determine the origin of every unmarked quotation.

New records are stored under private namespaces in the existing `site_settings` table: `kb:`, `kb-snapshot:`, `kb-verification:`, `voice:`, `embedding:`, `proposal:`, `version:`, `live-meta:`, `generation-log:`, `transcript:`, `editor:`, and `media:`. No public endpoint returns private records. Existing Supabase RLS denies browser-level table access. Generation has no SQL tools or publication capability. Only authenticated administrator routes can publish. Version immutability triggers are installed on first authorized use (requires the configured database role to create functions/triggers); `supabase/version-history.sql` provides the equivalent explicit migration. SQLite applies `drizzle/0004_version_immutability.sql` automatically in local demo mode.

### External AI configuration and current limits

- `AI_API_KEY`: server-only OpenAI API key. Never put it in a `NEXT_PUBLIC_` variable.
- `AI_MODEL`: optional ordering model; existing default `gpt-4.1-mini`.
- Semantic ranking uses `text-embedding-3-small` only for verified eligible source segments and the administrator's query, caching 256-dimensional vectors privately. Without a key, passage and keyword ranking remains available.
- Recording transcription uses `whisper-1`, retaining transcript segments/timestamps internally. Recordings up to 25 MB use an authorized signed upload directly to private Supabase storage, avoiding the Vercel request-body limit. The recording route increases the private bucket limit to 25 MB if needed and refuses a public bucket. Larger recordings must be compressed/split or supplied as transcripts. Provider integration cannot be exercised without a valid API key.
- YouTube URLs are metadata only. Paste an authorized transcript or upload the original recording. No YouTube scraping or automatic caption retrieval is implemented.
- Theological consistency is a required human review step. The current review UI identifies textual differences and duplicates; it does not claim automated theological-conflict adjudication.
- This is a working source-preserving foundation. Unconstrained prose rewriting, recordings larger than 25 MB, authorized YouTube caption retrieval, and richer automatic style/conflict analysis remain separate extensions, not claims of completed behavior.

Verification: production build and TypeScript checks, plus `work/editor-test.mjs` and `work/knowledge-test.mjs` exercise local-only fixtures. The latter tests denied anonymous access, unknown-default classification, quotation/link exclusion, verified-only profile/generation, explicit approval, live/draft isolation, metadata date stability, immutable versions, and rollback. Test fixtures must never be published to the production library.
