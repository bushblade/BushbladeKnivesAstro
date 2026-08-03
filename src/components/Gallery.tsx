import { useEffect, useRef, useState } from 'react'
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
	const dialogRef = useRef<HTMLDivElement | null>(null)
	const closeButtonRef = useRef<HTMLButtonElement | null>(null)
	const lastFocusedRef = useRef<HTMLElement | null>(null)
	const containerRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const media = window.matchMedia('(max-width: 779px)')
		setIsMobile(media.matches)
		const update = () => setIsMobile(media.matches)
		media.addEventListener('change', update)
		return () => media.removeEventListener('change', update)
	}, [])

	useEffect(() => {
		// Grid thumbs start invisible (opacity-0 text-transparent) so their generic
		// alt text doesn't flash; reveal each as it loads, instantly if already cached.
		const container = containerRef.current
		if (!container) return
		const reveal = (image: HTMLImageElement) => {
			image.classList.remove('opacity-0', 'text-transparent')
			image.style.opacity = '1'
		}
		container.querySelectorAll('img').forEach((image) => {
			if (image.complete) {
				reveal(image)
			} else {
				image.addEventListener('load', () => reveal(image), { once: true })
			}
		})
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
		const previousOverflow = html?.style.overflowY ?? null
		if (html) html.style.overflowY = open ? 'hidden' : 'visible'

		if (open) {
			lastFocusedRef.current = document.activeElement as HTMLElement | null
			closeButtonRef.current?.focus()
		} else {
			lastFocusedRef.current?.focus()
			lastFocusedRef.current = null
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setOpen(false)
				return
			}
			if (event.key === 'Tab') {
				const dialog = dialogRef.current
				if (!dialog) return
				const focusable = dialog.querySelectorAll<HTMLElement>(
					'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
				)
				const list = Array.from(focusable).filter((element) => !element.hasAttribute('disabled'))
				if (list.length === 0) return
				const first = list[0]
				const last = list[list.length - 1]
				if (event.shiftKey && document.activeElement === first) {
					last.focus()
					event.preventDefault()
				} else if (!event.shiftKey && document.activeElement === last) {
					first.focus()
					event.preventDefault()
				}
			}
		}
		if (open) window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
			if (html && previousOverflow !== null) html.style.overflowY = previousOverflow
		}
	}, [open])

	return (
		<>
			<div ref={containerRef}>
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
						button: {
							className:
								'bg-charcoal shadow-gallery rounded-[2px] overflow-hidden cursor-zoom-in group',
						},
						image: {
							className:
								'will-change-transform transition-[transform,scale,opacity] duration-300 ease-out group-hover:scale-105 scale-[1.006] opacity-0 text-transparent',
						},
					}}
				/>
			</div>
			{open
				? createPortal(
						<div
							ref={dialogRef}
							role="dialog"
							aria-modal="true"
							aria-label="Image gallery"
							className="animate-modal-in fixed inset-0 z-100 flex items-center justify-center bg-black/80"
						>
							<button
								type="button"
								ref={closeButtonRef}
								aria-label="Close gallery"
								onClick={() => setOpen(false)}
								className="fixed right-4 top-[0.4rem] z-102 block h-8 w-8 cursor-pointer"
							>
								<span className="absolute top-1/2 block h-[0.2rem] w-full -translate-y-1/2 rotate-45 rounded-[3px] bg-[whitesmoke]" />
								<span className="absolute top-1/2 block h-[0.2rem] w-full -translate-y-1/2 -rotate-45 rounded-[3px] bg-[whitesmoke]" />
							</button>
							<div aria-live="polite" className="sr-only">
								Image {current + 1} of {photos.length}
							</div>
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
								{photos.map((photo, index) => (
									// Cap at native resolution — the slider stretches slides to
									// viewport size and would otherwise upscale small sources.
									<img
										key={photo.key}
										src={photo.src}
										srcSet={srcSetOf(photo)}
										sizes="(max-width: 1200px) 100vw, 1200px"
										alt={photo.alt ?? 'knife'}
										aria-hidden={index !== current}
										style={{ maxWidth: photo.width, maxHeight: photo.height }}
										className="select-none object-contain"
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
