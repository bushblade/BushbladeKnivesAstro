import { getImage } from 'astro:assets'
import type { ImageMetadata } from 'astro'
import type { Photo } from 'react-photo-album'

export const buildGalleryPhotosFromDir = async (
	images: Record<string, ImageMetadata>,
): Promise<Photo[]> => {
	const sources = Object.entries(images)
		.map(([path, src]) => ({
			name: path.slice(path.lastIndexOf('/') + 1).replace(/\.\w+$/, ''),
			src,
		}))
		.sort((a, b) => b.name.localeCompare(a.name))
	return buildGalleryPhotos(sources)
}

export const buildGalleryPhotos = async (
	sources: readonly { name: string; alt?: string; src: ImageMetadata }[],
): Promise<Photo[]> =>
	Promise.all(
		sources.map(async (image) => {
			const variants = await Promise.all(
				[480, 800, 1200]
					.map((width) => Math.min(width, image.src.width))
					.filter((width, index, all) => all.indexOf(width) === index)
					.map((width) => getImage({ src: image.src, width })),
			)
			return {
				src: variants.at(-1)?.src ?? '',
				width: image.src.width,
				height: image.src.height,
				alt: image.alt ?? image.name,
				key: image.name,
				srcSet: variants.map(({ src, attributes }) => ({
					src,
					width: attributes.width,
					height: attributes.height,
				})),
			}
		}),
	)
