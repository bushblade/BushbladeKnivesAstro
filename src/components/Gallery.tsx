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
			wrapper: { className: 'gallery__photo' },
			image: { className: 'gallery__image' },
		}}
	/>
)

export default Gallery
