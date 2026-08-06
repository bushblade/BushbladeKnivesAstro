import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const posts = defineCollection({
	loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
	schema: ({ image }) =>
		z.object({
			slug: z.string(),
			title: z.string(),
			date: z.coerce.date(),
			author: z.string(),
			image: image(),
			keywords: z.string(),
			excerpt: z.string(),
		}),
})

export const collections = { posts }
