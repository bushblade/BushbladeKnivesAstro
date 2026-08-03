import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { type Photo, RowsPhotoAlbum } from 'react-photo-album'
import Slider from 'react-touch-drag-slider'
import ChevronLeft from './icons/ChevronLeft'
import ChevronRight from './icons/ChevronRight'
import 'react-photo-album/rows.css'

interface GalleryProps {
	photos: readonly Photo[]
	rowPolicy?: 'default' | 'natural'
}

const photosPerRow = (containerWidth: number) => {
	if (containerWidth < 700) return 2
	if (containerWidth < 1000) return 3
	return 6
}

const srcSetOf = (photo: Photo) =>
	photo.srcSet?.map(({ src, width }) => `${src} ${width}w`).join(', ') ?? photo.src

const naturalBreakpoints = () => ({
	narrow: window.matchMedia('(max-width: 699px)').matches,
	tablet: window.matchMedia('(min-width: 700px) and (max-width: 999px)').matches,
})

function Gallery({ photos, rowPolicy = 'default' }: GalleryProps) {
	const [open, setOpen] = useState(false)
	const [current, setCurrent] = useState(0)
	const [isMobile, setIsMobile] = useState(false)
	const [breakpoints, setBreakpoints] = useState({ narrow: false, tablet: false })

	useEffect(() => {
		const media = window.matchMedia('(max-width: 779px)')
		setIsMobile(media.matches)
		const update = () => setIsMobile(media.matches)
		media.addEventListener('change', update)
		return () => media.removeEventListener('change', update)
	}, [])

	useEffect(() => {
		if (rowPolicy !== 'natural') return
		const media = [
			window.matchMedia('(max-width: 699px)'),
			window.matchMedia('(min-width: 700px) and (max-width: 999px)'),
		]
		const update = () => setBreakpoints(naturalBreakpoints())
		update()
		media.forEach((query) => {
			query.addEventListener('change', update)
		})
		return () =>
			media.forEach((query) => {
				query.removeEventListener('change', update)
			})
	}, [rowPolicy])

	useEffect(() => {
		const html = document.querySelector('html') as HTMLElement | null
		if (html) html.style.overflowY = open ? 'hidden' : 'visible'

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setOpen(false)
		}
		if (open) window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [open])

	return (
		<>
			<RowsPhotoAlbum
				photos={photos}
				targetRowHeight={250}
				spacing={5}
				padding={0}
				defaultContainerWidth={1248}
				rowConstraints={(containerWidth) => {
					if (rowPolicy === 'natural') {
						if (breakpoints.narrow) return { maxPhotos: 1 }
						if (breakpoints.tablet) return { maxPhotos: 2 }
						return {}
					}
					const count = photosPerRow(containerWidth)
					return { minPhotos: count, maxPhotos: count }
				}}
				onClick={({ index }) => {
					setCurrent(index)
					setOpen(true)
				}}
				componentsProps={{
					wrapper: {
						className:
							'bg-charcoal shadow-gallery rounded-[2px] overflow-hidden cursor-zoom-in transition-shadow duration-200 ease-in-out group hover:shadow-gallery-hover',
					},
					image: {
						className:
							'transition-transform duration-[500ms] ease-[cubic-bezier(0.215,0.61,0.355,1)] group-hover:scale-105 scale-[1.006]',
					},
				}}
			/>
			{open
				? createPortal(
						<div className="animate-modal-in fixed inset-0 z-100 flex items-center justify-center bg-black/80">
							<button
								type="button"
								aria-label="Close gallery"
								onClick={() => setOpen(false)}
								className="fixed right-4 top-[0.4rem] z-102 block h-8 w-8 cursor-pointer"
							>
								<span className="absolute top-1/2 block h-[0.2rem] w-full -translate-y-1/2 rotate-45 rounded-[3px] bg-[whitesmoke]" />
								<span className="absolute top-1/2 block h-[0.2rem] w-full -translate-y-1/2 -rotate-45 rounded-[3px] bg-[whitesmoke]" />
							</button>
							{current !== 0 && !isMobile ? (
								<button
									type="button"
									aria-label="Previous image"
									onClick={() => setCurrent((index) => Math.max(0, index - 1))}
									className="fixed left-2 top-0 z-10 flex h-full cursor-pointer items-center px-4 py-12 text-5xl text-[whitesmoke] opacity-50 hover:opacity-80"
								>
									<ChevronLeft className="h-[1em] w-[1em]" />
								</button>
							) : null}
							{current !== photos.length - 1 && !isMobile ? (
								<button
									type="button"
									aria-label="Next image"
									onClick={() => setCurrent((index) => Math.min(photos.length - 1, index + 1))}
									className="fixed right-2 top-0 z-10 flex h-full cursor-pointer items-center px-4 py-12 text-5xl text-[whitesmoke] opacity-50 hover:opacity-80"
								>
									<ChevronRight className="h-[1em] w-[1em]" />
								</button>
							) : null}
							<Slider activeIndex={current} onSlideComplete={setCurrent} scaleOnDrag>
								{photos.map((photo) => (
									<img
										key={photo.key}
										src={photo.src}
										srcSet={srcSetOf(photo)}
										sizes="(max-width: 1200px) 100vw, 1200px"
										alt={photo.alt ?? 'knife'}
										className="max-w-300 select-none object-contain"
										onMouseDown={(event) => event.preventDefault()}
										onDragStart={(event) => event.preventDefault()}
									/>
								))}
							</Slider>
						</div>,
						document.body,
					)
				: null}
		</>
	)
}

export default Gallery
