# REVERB Inc.

Full-stack React website for REVERB Inc. The original static page remains in `index Reverb.html` as a design reference.

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173`. The React development server proxies `/api` to the Node API on port 8787.

## Production

```bash
npm run build
ADMIN_TOKEN="a-long-random-secret" npm start
```

The production server serves `dist/` and stores enquiries in `data/reverb.sqlite`. Back up that file persistently when deploying. Retrieve enquiries with `GET /api/admin/enquiries` and `Authorization: Bearer <ADMIN_TOKEN>`.

## Content still required

- Cleared audio demo files and their language/project metadata
- Video reel URLs
- Approved case studies, testimonials, talent bios, and client logos
- WhatsApp number and scheduling URL
- Analytics site ID
- Professional Hindi and Kannada translations
- Email provider credentials if instant staff notifications are required

The UI exposes an honest pending state for audio instead of publishing fake portfolio work. Once assets are supplied, put them in `public/audio/` and connect them through `src/data/site.js`.
