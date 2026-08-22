import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Photo } from 'react-photo-album'
import Slider from 'react-touch-drag-slider'
import ChevronLeft from './icons/ChevronLeft'
import ChevronRight from './icons/ChevronRight'

interface LightboxProps {
	photos: readonly Photo[]
	current: number
	onClose: () => void
	onNavigate: (index: number) => void
}

const srcSetOf = (photo: Photo) =>
	photo.srcSet?.map(({ src, width }) => `${src} ${width}w`).join(', ') ?? photo.src

function Lightbox({ photos, current, onClose, onNavigate }: LightboxProps) {
	const [isMobile, setIsMobile] = useState(false)
	const dialogRef = useRef<HTMLDivElement | null>(null)
	const closeButtonRef = useRef<HTMLButtonElement | null>(null)
	const lastFocusedRef = useRef<HTMLElement | null>(null)

	useEffect(() => {
		const media = window.matchMedia('(max-width: 779px)')
		setIsMobile(media.matches)
		const update = () => setIsMobile(media.matches)
		media.addEventListener('change', update)
		return () => media.removeEventListener('change', update)
	}, [])

	useEffect(() => {
		const html = document.querySelector('html') as HTMLElement | null
		const previousOverflow = html?.style.overflowY ?? null
		if (html) html.style.overflowY = 'hidden'

		lastFocusedRef.current = document.activeElement as HTMLElement | null
		closeButtonRef.current?.focus()

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose()
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
		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
			if (html) html.style.overflowY = previousOverflow ?? 'visible'
			lastFocusedRef.current?.focus()
			lastFocusedRef.current = null
		}
	}, [onClose])

	return createPortal(
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
				onClick={onClose}
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
					onClick={() => onNavigate(Math.max(0, current - 1))}
					className="fixed left-2 top-0 z-10 flex h-full cursor-pointer items-center px-4 py-12 text-5xl text-[whitesmoke] opacity-50 hover:opacity-80"
				>
					<ChevronLeft className="h-[1em] w-[1em]" />
				</button>
			) : null}
			{current !== photos.length - 1 && !isMobile ? (
				<button
					type="button"
					aria-label="Next image"
					onClick={() => onNavigate(Math.min(photos.length - 1, current + 1))}
					className="fixed right-2 top-0 z-10 flex h-full cursor-pointer items-center px-4 py-12 text-5xl text-[whitesmoke] opacity-50 hover:opacity-80"
				>
					<ChevronRight className="h-[1em] w-[1em]" />
				</button>
			) : null}
			<Slider activeIndex={current} onSlideComplete={onNavigate} scaleOnDrag>
				{photos.map((photo, index) => (
					<img
						key={photo.key}
						src={photo.src}
						srcSet={srcSetOf(photo)}
						sizes="(max-width: 1200px) 100vw, 1200px"
						alt={photo.alt ?? 'knife'}
						aria-hidden={index !== current}
						style={{ maxWidth: photo.width, maxHeight: '1000px' }}
						className="select-none object-contain"
						onMouseDown={(event) => event.preventDefault()}
						onDragStart={(event) => event.preventDefault()}
					/>
				))}
			</Slider>
		</div>,
		document.body,
	)
}

export default Lightbox
