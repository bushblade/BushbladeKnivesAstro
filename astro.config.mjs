// @ts-check

import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import { rehypePostContent } from './src/utils/rehype-post-content'

// https://astro.build/config
export default defineConfig({
	site: 'https://bushblade.co.uk',
	integrations: [react(), sitemap()],
	markdown: {
		rehypePlugins: [rehypePostContent],
	},
	redirects: {
		'/woodlore-clone': '/knives/woodlore-clone',
		'/midi': '/knives/midi',
	},
	vite: {
		plugins: [tailwindcss()],
	},
})
