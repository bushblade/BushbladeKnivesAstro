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

interface HastText {
	type: 'text'
	value: string
}

type HastNode = HastElement | HastRoot | HastText | { type: string; children?: HastNode[] }

const INLINE_LINK_CLASSES = [
	'transition-all',
	'hover:bg-olive',
	'shadow-underline-medium-gray',
	'text-olive-gray',
	'font-semibold',
]

const TAG_CLASSES: Record<string, string[]> = {
	h2: ['text-3xl', 'mt-8', 'mb-4'],
	h3: ['text-2xl', 'mt-6', 'mb-2'],
	h4: ['text-center', 'italic'],
	p: ['mt-4'],
	hr: ['my-8', 'border-0', 'h-px', 'bg-black/20'],
	ul: ['pl-6', 'my-4'],
	ol: ['pl-6', 'my-4'],
	li: ['mt-1'],
}

function addClasses(el: HastElement, classes: string[]) {
	const existing = Array.isArray(el.properties.className)
		? el.properties.className
		: el.properties.className
			? [el.properties.className]
			: []
	el.properties.className = [...existing, ...classes]
}

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
				el.children.push({
					type: 'element',
					tagName: 'span',
					properties: { className: ['sr-only'] },
					children: [{ type: 'text', value: '(opens in new tab)' }],
				})
			}
			addClasses(el, INLINE_LINK_CLASSES)
		}

		const classes = TAG_CLASSES[el.tagName]
		if (classes) {
			addClasses(el, classes)
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
