import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * The 3D cover-flow slider from the reference template.
 *
 * Cards fan out on a 1000px perspective: each step away from centre shifts
 * 60%, sinks 150px, yaws 45deg and loses scale and opacity. It advances on
 * its own while on screen, pauses on hover, and takes horizontal swipes.
 */
export function CoverflowGallery({ images, altPrefix = 'Wedding photo', onImageClick }) {
  const count = images.length
  const [index, setIndex] = useState(0)
  const [ratios, setRatios] = useState({})
  const [hovered, setHovered] = useState(false)
  const [interacted, setInteracted] = useState(false)
  const [onScreen, setOnScreen] = useState(false)
  const [reduced, setReduced] = useState(false)

  const containerRef = useRef(null)
  const touchStart = useRef(null)
  const resumeTimer = useRef(null)

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count])
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count])

  /* A manual nudge suspends autoplay for six seconds. */
  const pauseAutoplay = useCallback(() => {
    setInteracted(true)
    if (resumeTimer.current) clearTimeout(resumeTimer.current)
    resumeTimer.current = setTimeout(() => setInteracted(false), 6000)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = (e) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      threshold: 0,
      rootMargin: '300px 0px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (count <= 1 || hovered || interacted || !onScreen || reduced) return
    const id = setInterval(next, 3200)
    return () => clearInterval(id)
  }, [count, hovered, interacted, onScreen, reduced, next])

  useEffect(() => () => resumeTimer.current && clearTimeout(resumeTimer.current), [])

  const onTouchStart = (e) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }

  const onTouchEnd = (e) => {
    if (!touchStart.current) return
    const dx = e.changedTouches[0].clientX - touchStart.current.x
    const dy = Math.abs(e.changedTouches[0].clientY - touchStart.current.y)
    touchStart.current = null
    if (Math.abs(dx) > 50 && Math.abs(dx) > dy) {
      dx < 0 ? next() : prev()
      pauseAutoplay()
    }
  }

  /* Shortest signed distance from `i` to the active card, wrapping around. */
  const offsetOf = (i) => {
    const raw = i - index
    if (raw > count / 2) return raw - count
    if (raw < -count / 2) return raw + count
    return raw
  }

  const arrow = (dir) => (
    <button
      type="button"
      aria-label={dir === 'prev' ? 'Previous photo' : 'Next photo'}
      onClick={() => {
        pauseAutoplay()
        dir === 'prev' ? prev() : next()
      }}
      className={`absolute top-1/2 z-[200] hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#f7e3cd]/70 text-[#640e1b] transition-colors hover:bg-[#f7e3cd] md:flex ${
        dir === 'prev' ? 'left-0' : 'right-0'
      }`}
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={dir === 'prev' ? 'M15.75 19.5L8.25 12l7.5-7.5' : 'M8.25 4.5l7.5 7.5-7.5 7.5'}
        />
      </svg>
    </button>
  )

  return (
    <div
      ref={containerRef}
      className="mt-6 w-full max-w-[432px] md:max-w-[600px]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative h-[340px] touch-pan-y md:h-[520px]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {count > 1 && arrow('prev')}
        {count > 1 && arrow('next')}

        <div
          className="relative flex h-full w-full items-center justify-center"
          style={{ perspective: '1000px' }}
        >
          {images.map((image, i) => {
            const offset = offsetOf(i)
            const distance = Math.abs(offset)
            const active = offset === 0
            const scale = Math.max(0.7, 1 - 0.15 * distance)
            const opacity = Math.max(0.3, 1 - 0.25 * distance)

            return (
              <div
                key={image.src}
                className={`absolute h-[92%] cursor-pointer overflow-hidden rounded-2xl shadow-xl transition-all ease-in-out ${
                  active ? 'ring-2 ring-[#ab7a45]/50' : ''
                }`}
                style={{
                  aspectRatio: Math.min(1.2, Math.max(0.5, ratios[i] ?? 0.72)),
                  transitionDuration: '1100ms',
                  transform: `translateX(${60 * offset}%) translateZ(${-(150 * distance)}px) rotateY(${45 * offset}deg) scale(${scale})`,
                  opacity,
                  zIndex: 100 - distance,
                }}
                onClick={() => {
                  if (active) onImageClick?.(i)
                  else {
                    setIndex(i)
                    pauseAutoplay()
                  }
                }}
              >
                <img
                  src={image.src}
                  alt={`${altPrefix} ${i + 1}`}
                  className="h-full w-full object-cover"
                  loading={distance <= 1 ? 'eager' : 'lazy'}
                  decoding="async"
                  onLoad={(e) => {
                    const { naturalWidth: w, naturalHeight: h } = e.currentTarget
                    if (w && h) setRatios((r) => (r[i] ? r : { ...r, [i]: w / h }))
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>

      {count > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {images.map((image, i) => (
            <button
              key={image.src}
              type="button"
              aria-label={`Go to photo ${i + 1}`}
              onClick={() => {
                setIndex(i)
                pauseAutoplay()
              }}
              className={`rounded-full bg-[#640e1b] transition-all duration-300 ${
                i === index ? 'h-2 w-6 opacity-70' : 'h-2 w-2 opacity-25 hover:opacity-40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
