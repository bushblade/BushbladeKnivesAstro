import { type Photo, RowsPhotoAlbum } from 'react-photo-album'
import 'react-photo-album/rows.css'

interface GalleryProps {
	photos: readonly Photo[]
}

const photosPerRow = (containerWidth: number) => {
	if (containerWidth < 700) return 2
	if (containerWidth < 1000) return 3
	return 6
}

const Gallery = ({ photos }: GalleryProps) => (
	<RowsPhotoAlbum
		photos={photos}
		targetRowHeight={250}
		spacing={5}
		padding={0}
		defaultContainerWidth={1248}
		rowConstraints={(containerWidth) => {
			const columns = photosPerRow(containerWidth)
			return { minPhotos: columns, maxPhotos: columns }
		}}
		componentsProps={{
			wrapper: {
				className:
					'shadow-gallery rounded-[2px] overflow-hidden cursor-zoom-in transition-shadow duration-200 ease-in-out group hover:shadow-gallery-hover',
			},
			image: {
				className:
					'transition-transform duration-[600ms] ease-[cubic-bezier(0.215,0.61,0.355,1)] will-change-transform group-hover:scale-105',
			},
		}}
	/>
)

export default Gallery
