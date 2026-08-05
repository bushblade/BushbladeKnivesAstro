export const SITE = {
	title: 'Bushblade Knives',
	description: 'Handmade knives by Will Adams',
	author: 'Will Adams',
	twitterHandle: 'bushblade',
	themeColor: '#c2c2a3',
	url: 'https://bushblade.co.uk',
	prices: {
		midi: '255',
		woodloreClone: '320',
	},
}

export function formatTitle(title?: string): string {
	return title ? `${title} | ${SITE.title}` : SITE.title
}
