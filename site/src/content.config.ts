import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

// One page per component (docs/decisions/0006-website.md), in the order of Headless UI's list.
const components = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content/components' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
    /** Needs @kodentuzo/spotstrap/js in plain HTML. */
    js: z.boolean().default(false),
  }),
})

export const collections = { components }
