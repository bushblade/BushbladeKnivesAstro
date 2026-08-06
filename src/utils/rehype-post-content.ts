import { SITE } from '../data/site'

interface HastProperties {
	[key: string]: unknown
	className?: string | string[]
	href?: string
	target?: string
	rel?: string
}

interface HastElement {
	type: 'element'
	tagName: string
	properties: HastProperties
	children: HastNode[]
}

interface HastRoot {
	type: 'root'
	children: HastNode[]
}

type HastNode = HastElement | HastRoot | { type: string; children?: HastNode[] }

const INLINE_LINK_CLASSES = [
	'transition-all',
	'hover:bg-olive',
	'shadow-underline-medium-gray',
	'text-olive-gray',
	'font-semibold',
]

function isExternal(href: string): boolean {
	try {
		const url = new URL(href)
		const site = new URL(SITE.url)
		return url.hostname !== site.hostname
	} catch {
		return false
	}
}

function walk(node: HastNode) {
	if (node.type === 'element') {
		const el = node as HastElement

		if (el.tagName === 'a') {
			const href = el.properties.href
			if (typeof href === 'string' && isExternal(href)) {
				el.properties.target = '_blank'
				el.properties.rel = 'noopener noreferrer'
			}
			const existing = Array.isArray(el.properties.className)
				? el.properties.className
				: el.properties.className
					? [el.properties.className]
					: []
			el.properties.className = [...existing, ...INLINE_LINK_CLASSES]
		}

		if (el.tagName === 'img') {
			const existing = Array.isArray(el.properties.className)
				? el.properties.className
				: el.properties.className
					? [el.properties.className]
					: []
			el.properties.className = [...existing, 'image-fade']
		}
	}

	if ('children' in node && node.children) {
		for (const child of node.children) {
			walk(child)
		}
	}
}

export function rehypePostContent() {
	return (tree: HastRoot) => {
		walk(tree)
	}
}
