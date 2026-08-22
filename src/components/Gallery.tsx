import { useState } from 'react'
import { type Photo, RowsPhotoAlbum } from 'react-photo-album'
import Lightbox from './Lightbox'
import 'react-photo-album/rows.css'

interface GalleryProps {
	photos: readonly Photo[]
}

function Gallery({ photos }: GalleryProps) {
	const [open, setOpen] = useState(false)
	const [current, setCurrent] = useState(0)

	return (
		<>
			<div>
				<RowsPhotoAlbum
					photos={photos}
					spacing={10}
					targetRowHeight={250}
					onClick={({ index }) => {
						setCurrent(index)
						setOpen(true)
					}}
					componentsProps={{
						button: {
							className:
								'bg-charcoal shadow-gallery rounded-[2px] overflow-hidden cursor-zoom-in group',
						},
						image: {
							className:
								'will-change-transform transition-[transform,scale] duration-300 ease-out group-hover:scale-105 scale-[1.006] text-transparent animate-fade-in',
						},
					}}
				/>
			</div>
			{open ? (
				<Lightbox
					photos={photos}
					current={current}
					onClose={() => setOpen(false)}
					onNavigate={setCurrent}
				/>
			) : null}
		</>
	)
}

export default Gallery
