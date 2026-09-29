# REVERB Inc.

SEO-first Astro website with selective React islands, designed for static delivery through Cloudflare Pages.

## Stack

- Astro static pages and content collections
- React islands for the enquiry form and testimonial slider
- Cloudflare Pages and Pages Functions
- Cloudflare Turnstile for bot verification
- Supabase Postgres for enquiry storage and future admin authentication
- Resend for enquiry notifications

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:4321`. The form API runs on Cloudflare Pages in production; use Wrangler for end-to-end local function testing.

## Verification

```bash
npm run check
npm test
npm run build
```

The build outputs static pages to `dist/` and automatically generates the sitemap.

## Vercel

Use Node.js 24.x. `vercel.json` configures Astro, a clean `npm ci` install,
`npm run build`, and the `dist` output directory. Commit both `package.json`
and `package-lock.json` when changing dependencies. The direct dependency
versions are pinned to keep deployment installs reproducible.

If retrying a failed deployment after updating these files, redeploy without
the existing build cache. The website is static; the enquiry handler in
`functions/api/enquiries.js` uses Cloudflare Pages Functions and needs a
Vercel-compatible API implementation before form submissions work on Vercel.

## Cloudflare Pages

1. Connect the GitHub repository to Cloudflare Pages.
2. Set build command to `npm run build`.
3. Set output directory to `dist`.
4. Add the secrets listed in `.env.example` through the Cloudflare dashboard.
5. Add a rate-limiting rule for `POST /api/enquiries`.
6. Connect `wereverb.com` and redirect alternate hostnames to the canonical HTTPS hostname.

## Supabase

1. Create a Supabase project in the preferred data region.
2. Run `supabase/schema.sql` in its SQL editor.
3. Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` only to Cloudflare's encrypted server environment.
4. Never expose the service-role key through a `PUBLIC_` variable or browser bundle.
5. Add admin-user policies before building the authenticated enquiry dashboard.

## Turnstile and Resend

- Create a Turnstile widget for the production and preview hostnames.
- Add its secret as `TURNSTILE_SECRET` and connect the public widget key when the final domain is active.
- Verify `wereverb.com` in Resend and configure the sender and recipient variables.
- The Worker stores the enquiry first, then sends the staff notification.

## Content

Insights are Markdown files in `src/content/insights/`. Page metadata and schema are rendered into the initial HTML.

Before launch, replace:

- Add alternate crops or newer approved portraits if needed; the supplied founder artwork is currently published responsively
- Placeholder founder biography with approved 100-word and 400-word versions
- Placeholder testimonials with 3–6 permission-cleared client quotations
- Pending audio cards with cleared demo files and metadata
- Service-page placeholder copy with process, deliverables, samples, FAQs, and case studies
- `public/og.png` with a 1200×630 social image

The previous static implementation is retained as `legacy-index.html` for visual reference only.
