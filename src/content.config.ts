import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const insights = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/insights' }),
  schema: z.object({
    title: z.string(), description: z.string(), publishedAt: z.coerce.date(),
    author: z.string().default('REVERB Inc.'), image: z.string().optional(), draft: z.boolean().default(false),
  }),
})

export const collections = { insights }
