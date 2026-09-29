import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://wereverb.com',
  output: 'static',
  integrations: [react(), sitemap({ filter: (page) => !page.endsWith('/thank-you/') })],
  build: { assets: 'assets' },
})
