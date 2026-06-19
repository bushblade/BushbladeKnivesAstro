export interface PageLink {
	href: string
	label: string
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
