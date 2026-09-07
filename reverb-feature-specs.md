# REVERB Inc. — Feature Spec Sheet (for implementation)

Context for whoever builds this: the current site (`index_Reverb.html`) is a single-file, no-framework "coming soon" landing page with a defined design system already in place. Any new feature should reuse these existing tokens/patterns rather than introducing new ones.

## Existing design system to reuse
```css
--bg:      #f7f4ed   /* warm paper background */
--ink:     #141416   /* primary text */
--ink-2:   #55555b   /* body/secondary text */
--ink-3:   #6c6c72   /* labels */
--ink-4:   #b8b8bc   /* faint */
--line:    rgba(20,20,22,0.10)
--line-2:  rgba(20,20,22,0.18)
--accent:      #a8560b  /* burnt amber */
--accent-red:  #c8301d  /* used sparingly */
--serif: "Instrument Serif" (headings/display, italic used for emphasis)
--sans:  "Inter" (body/UI)
```
- Sections use the numbered pattern: `<span class="section-num">04</span> <span class="section-name">Label</span>`, bordered top, `.section` padding scale.
- Scroll-in animation: add class `reveal` to any new section; it's handled automatically by the existing `IntersectionObserver` script — no new JS needed for basic fade-ins.
- Load-in animation: `.enter` + inline `style="--d: 200ms"` for staggered hero-style entrances.
- Respect `prefers-reduced-motion` — already globally handled, just don't fight it with new inline animations.
- Any new interactive element needs a `:focus-visible` state — the existing amber ring style applies automatically since it's on `:focus-visible` globally.

---

## 1. Audio Demo Reel — HIGHEST PRIORITY

**Purpose:** Right now there is zero proof that Reverb actually does voice work. This is a language studio with no audio anywhere on the page.

**What to build:**
- New section, `section-num="0X"`, label "Hear the work" or "The reel."
- A horizontally scrollable or grid set of 4–8 audio cards. Each card:
  - Language name (e.g. "Kannada", "Telugu", "Hindi") — both in Latin script and native script (ಕನ್ನಡ, తెలుగు, हिन्दी) for visual richness.
  - Project type tag (Dubbing / Voice-over / Micro drama / Ad).
  - Native `<audio controls>` element pointing to an `.mp3`/`.m4a` file, OR a custom-styled play button that controls a shared `Audio()` object in JS (recommended for design consistency — native browser audio controls will clash with the editorial aesthetic).
- Custom player suggestion: simple play/pause circular button (reuse `--accent` color), a thin progress line (reuse `--line-2`), and elapsed time in `--ink-3`. Keep it minimal — no waveform visualization needed for v1.
- **Content needed from Reverb:** 4–8 short (15–45 sec) audio clips, ideally across different languages/services, each with a client name if permitted, or "Demo reel" if anonymized.
- **Technical notes:**
  - Only one clip should play at a time — pause others when a new one starts.
  - Files should be compressed (128kbps mp3 is plenty for voice) and hosted alongside the site or on a CDN — don't inline as base64 (unlike the favicon), audio files are too large for that.
  - Add `preload="none"` on audio elements so page load isn't slowed by files that may never play.

---

## 2. Video Reel (Micro Drama / AI Micro Videos)

**Purpose:** Two of the five listed services (Micro Drama, AI Micro Videos) are inherently visual — text alone undersells them.

**What to build:**
- A section similar to the audio reel, but with either:
  - A YouTube/Vimeo embed grid (simplest — just `<iframe>`s, lazy-loaded), or
  - Self-hosted muted autoplay `<video loop muted playsinline>` thumbnails that expand to full playback on click (nicer UX, more engineering work).
- Recommend starting with YouTube embeds since Reverb already runs YouTube channels (Dive Deep, Gramarajya, Navonnathi, Reverb Om) — pull 3–4 relevant clips from those rather than producing new assets.
- Use `loading="lazy"` on iframes to avoid hurting page speed.

---

## 3. Portfolio / Case Study Cards

**Purpose:** Turns the "1000+ projects" stat from an abstract number into something a prospective client can actually evaluate.

**What to build:**
- 4–6 case study cards in a grid (reuse the `.coming-list`/`.coming-item` numbered-list pattern, or a new 2–3 column grid depending on content density).
- Each card: client/project name (or category if NDA'd), languages involved, service type, one-sentence outcome/result. Optional thumbnail image.
- Keep copy terse — this is a scannable proof-point section, not a blog.
- **Content needed:** a list of 4–6 real projects with enough detail to describe (even anonymized: "Pan-India OTT series — 8 languages — delivered in 3 weeks").

---

## 4. Client Logo Strip

**Purpose:** Fast, low-effort trust signal.

**What to build:**
- A simple horizontal row (or auto-scrolling marquee) of 5–8 client/partner logos, grayscale by default with a subtle color-on-hover transition (matches existing hover patterns like `.foot-mail:hover`).
- If logo usage isn't clearable, skip this — don't fake it with placeholder logos.

---

## 5. Real Inquiry / Quote Form

**Purpose:** The only current CTA is a `mailto:` link, which fails silently on any device without a configured mail client (a real problem on mobile).

**What to build:**
- A form (can be a new section, or a modal triggered from the CTA) with fields:
  - Name, Email, Company (optional)
  - Service needed — dropdown or radio: Voice Over/Dubbing/Localization, Micro Drama, AI Micro Videos, Digital Marketing, Original Content, Other
  - Language(s) needed — free text or multi-select
  - Project scope — short textarea
  - Budget range — optional dropdown (helps qualify leads)
  - Timeline — optional
- **Backend note:** since this is currently a static HTML file with no server, form submission needs one of:
  - A form service (Formspree, Basin, Getform) — fastest to wire up, just a POST endpoint, no backend code needed.
  - A serverless function (Netlify/Vercel forms or a small function) if more control over routing to `hello@wereverb.com` / `reverb.mails@gmail.com` is wanted.
- Style inputs to match the editorial aesthetic: underline-only inputs (like `.cta`'s `border-bottom` style) rather than boxed inputs, `--sans` font, `--ink-2` placeholder text, `--accent` focus/underline color.
- On submit: inline success state ("We'll be in touch within 1 business day") rather than a redirect, to keep the single-page feel.

---

## 6. Per-Service Quote Shortcuts

**Purpose:** Segment leads before first contact so Reverb isn't manually triaging generic "hi, tell me more" emails.

**What to build:**
- On the "What's coming" (services) section, each of the 5 service items gets a small "Enquire about this" link that pre-fills the Service dropdown in the inquiry form (via anchor + query param or JS pre-select) or pre-fills the `mailto:` subject line as a lighter-weight version (`?subject=Enquiry: Micro Drama`).
- The lighter mailto version is a 10-minute change if the full form isn't built yet — worth doing regardless as an incremental improvement.

---

## 7. Booking / Call Scheduling Embed

**Purpose:** Reduces email back-and-forth for qualified leads.

**What to build:**
- Embed a Calendly (or Cal.com) inline widget or a styled button that opens their scheduling page in a new tab.
- Place near the inquiry form or in the footer CTA area.
- Low effort, third-party script — just confirm it doesn't visually clash (Calendly's default widget can be restyled via their branding settings to roughly match the palette).

---

## 8. WhatsApp Business Link

**Purpose:** For an India-based B2B studio, WhatsApp is often the preferred first-contact channel over email.

**What to build:**
- A simple link: `https://wa.me/<number>?text=<pre-filled message>` styled like the existing footer social links (`.foot-social a`).
- Could also live as a small floating action button (bottom-right) — but that would be a departure from the current minimal-chrome aesthetic, so recommend keeping it inline in the footer/header instead unless Reverb specifically wants a persistent chat bubble.

---

## 9. Interactive Language Grid

**Purpose:** Makes "22+ languages" tangible and visually reinforces the multilingual identity — currently it's just a number in the stats block.

**What to build:**
- A new section: a grid/wrap of language "chips" or a loose typographic cluster, each showing the language name in both English and native script (e.g. "Kannada · ಕನ್ನಡ", "Tamil · தமிழ்", "Bengali · বাংলা").
- On hover (desktop) or tap (mobile), could reveal a small flag or a one-word description ("Native to Karnataka" etc.) — optional polish, not required for v1.
- Typographic treatment: use `--serif` italic for native-script text sizes to echo the `.display em` treatment already used in the hero, so it feels native to the design system rather than bolted on.
- **Content needed:** confirmed list of all 22+ languages with native-script spellings (worth having a native speaker or translator verify each script, not just machine-translate).

---

## 10. Native-Speaker / Talent Bios

**Purpose:** Signals real human craft (important against increasing "AI voice" skepticism), especially relevant since Reverb also explicitly offers AI Micro Videos — separating "human dubbing" credibility is worth doing deliberately.

**What to build:**
- Small profile cards: name/alias, languages, years of experience, maybe a one-line specialty ("Kannada TV/Radio," "Telugu dubbing"). Photo optional (many voice artists prefer anonymity).
- Could double as an audio-reel tie-in: clicking a bio plays their demo clip from Section 1.

---

## 11. Blog / Insights Section

**Purpose:** SEO. The site already has strong meta/schema fundamentals (Open Graph, JSON-LD Organization+OfferCatalog) but zero indexable content beyond the homepage — a blog is what actually drives organic search traffic over time.

**What to build:**
- Simple list of articles (title, date, 1-line excerpt) linking to individual post pages.
- Topics: "How OTT platforms localize for India," "Dubbing vs. subtitling: when to use which," "The state of micro-drama in India," industry commentary tied to Reverb's actual expertise.
- Each post page should carry its own meta description + `Article` JSON-LD (parallel to the existing `Organization` schema) for individual search visibility.
- This is the one item on this list that's a genuine content/writing commitment, not just a design/dev task — flag that to Reverb before scoping engineering time.

---

## 12. Dedicated Per-Service Landing Pages

**Purpose:** One page trying to rank for "voice over Bengaluru," "dubbing services India," "micro drama production," and "digital marketing agency" simultaneously will rank for none of them well. Split SEO targeting.

**What to build:**
- 5 pages (`/voice-overs`, `/micro-drama`, `/ai-micro-videos`, `/digital-marketing`, `/original-content`), each inheriting the same design system, header/footer, but with:
  - Its own `<title>`/meta description targeting that service's keywords.
  - Its own `Service` JSON-LD (already drafted in the existing Organization schema — can be lifted out into standalone per-page schema).
  - Service-specific proof: relevant audio/video samples, relevant case studies, relevant CTA.
- Larger scope item — reasonable to phase in one service page at a time rather than all five at once.

---

## 13. FAQ Section

**Purpose:** Answers pre-purchase objections without needing a sales call — reduces friction for smaller/self-serve inquiries.

**What to build:**
- Accordion-style Q&A (expand/collapse), reusing `.reveal` for entrance and a simple JS toggle (no framework needed — a `<details>/<summary>` native HTML element could even work here with custom styling, avoiding new JS entirely).
- Suggested starter questions: typical turnaround time, pricing model (per-minute/per-project), file formats delivered, revision policy, minimum project size, how language pairs are matched to talent.

---

## 14. Testimonials

**Purpose:** Third-party trust signal, cheap to build once quotes are collected.

**What to build:**
- A simple carousel or static 2–3 column grid of quote cards: quote text, client name/title/company.
- Reuse `.story-lead` typographic treatment (serif, larger size) for the quote text itself to keep it feeling editorial rather than boxed-in like a typical testimonial widget.

---

## 15. Animated Stat Counters

**Purpose:** Small polish item — the existing `.stats` block (1000+ projects / 22+ languages / 20 yrs) is static; animating the count-up on scroll-into-view would feel more alive and ties naturally into the existing reveal system.

**What to build:**
- On `.reveal`'s IntersectionObserver callback (already fires per-element), trigger a small JS count-up from 0 to the target number over ~1200ms when the `.stats` section becomes visible, respecting `prefers-reduced-motion` (skip animation, show final number immediately) exactly like the rest of the site already does.
- Low risk, ties into existing infrastructure — good "quick win" to bundle with other work.

---

## 16. Newsletter Signup

**Purpose:** Reverb already runs 4 podcast/YouTube properties (Dive Deep, Gramarajya, Navonnathi, Reverb Om) listed under "Original Content" — a signup captures that audience for direct marketing instead of relying on platform algorithms.

**What to build:**
- Simple email input + submit button, styled like the inquiry form inputs.
- Backend: connect to Mailchimp/ConvertKit/Buttondown or similar — needs an account and API key/form endpoint from Reverb, not something to build from scratch.
- Placement: footer, or as its own small section near "Original Content" mentions.

---

## 17. Multilingual Site Toggle

**Purpose:** Notable gap for a language company to have an English-only site. Even a partial implementation is a strong statement piece.

**What to build:**
- Start with 2–3 languages: English, Hindi, Kannada (Kannada especially, given Pradeep's Kannada TV/Namma Metro background).
- Technical approaches, roughly in order of effort:
  1. **Static duplicate pages** (`/`, `/hi/`, `/kn/`) with translated copy — simplest, no JS framework needed, works with the current single-file approach scaled to 3 files.
  2. **Client-side JS toggle** swapping text content via a small translation dictionary — keeps one file, but content is in the DOM either way so no SEO benefit per-language (search engines index one language).
  3. **Full i18n framework** (only worth it if Reverb migrates off a static single-file site to a proper build system) — overkill for current scope.
- Recommend option 1 for SEO value (each language gets its own indexable URL) given how much SEO groundwork is already in the `<head>`.
- **Content needed:** professional translations of all hero/section copy — don't machine-translate a page whose entire value proposition is linguistic authenticity.

---

## 18. Analytics

**Purpose:** Currently no way to know how visitors behave, what converts, where they drop off.

**What to build:**
- Add either Google Analytics 4 (`gtag.js` snippet) or a privacy-friendlier option like Plausible/Fathom (single lightweight script tag, no cookie consent banner needed in most jurisdictions since they don't use cookies).
- Given the aesthetic/performance care already put into this page (grain textures, blur transitions, minimal external requests), Plausible/Fathom is a better philosophical fit than GA4's heavier script — worth flagging as a recommendation, not just a default choice.

---

## 19. Sitemap & Robots.txt

**Purpose:** Housekeeping — confirm these exist since the `<head>` already has strong meta/schema work that a missing sitemap/robots.txt would partially waste.

**What to build:**
- `robots.txt` at root allowing all crawlers, pointing to sitemap location.
- `sitemap.xml` listing all pages (grows in value once blog/service pages from items 11–12 exist).
- One-time, ~15 minute task, no ongoing maintenance beyond updating when new pages are added.

---

## Suggested implementation order

1. **Audio demo reel** (#1) + **lighter mailto pre-fill on services** (#6, quick win) — biggest credibility gap, smallest content dependency.
2. **Real inquiry form** (#5) — fixes the mailto reliability problem.
3. **Language grid** (#9) + **animated stat counters** (#15) — cheap visual polish reusing existing systems.
4. **Case studies** (#3) + **testimonials** (#14) — as soon as content/quotes can be gathered.
5. **Analytics + sitemap/robots** (#18, #19) — do alongside any of the above, it's infrastructure not a feature.
6. **Blog + per-service pages** (#11, #12) — longer-term SEO investment, phase in gradually.
7. **Multilingual toggle** (#17), **WhatsApp** (#8), **booking embed** (#7), **newsletter** (#16), **talent bios** (#10), **video reel** (#2), **client logos** (#4) — round these out opportunistically as content becomes available.
