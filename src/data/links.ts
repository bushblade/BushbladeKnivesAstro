export interface PageLink {
	href: string
	label: string
}

export function isActive(href: string, currentPath: string): boolean {
	const path = currentPath.replace(/\/+$/, '') || '/'
	return path === href || (href !== '/' && path.startsWith(`${href}/`))
}

export const leftLinks: PageLink[] = [
	{ href: '/', label: 'Home' },
	{ href: '/about', label: 'About' },
	{ href: '/contact', label: 'Contact' },
	{ href: '/posts', label: 'Posts' },
]

export const rightLinks: PageLink[] = [
	{ href: '/knives/woodlore-clone', label: 'Woodlore Clone' },
	{ href: '/knives/midi', label: 'Midi' },
]
