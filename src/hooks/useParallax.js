import { useEffect, useRef } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Drifts a decorative element as it crosses the viewport.
 *
 * Returns a ref. `factor` is the share of the scroll delta the element
 * absorbs — positive lags behind the page, negative runs ahead of it.
 * `template` lets a mirrored decoration keep its scaleX(-1).
 */
export function useParallax(factor = 0.08, template = 'translateY({y})', clamp = 120) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    let frame = 0
    let visible = false

    const apply = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const viewportCentre = window.innerHeight / 2
      const elementCentre = rect.top + rect.height / 2
      const offset = (elementCentre - viewportCentre) * factor
      const y = Math.max(-clamp, Math.min(clamp, offset))
      el.style.transform = template.replace('{y}', `${y.toFixed(2)}px`)
    }

    const onScroll = () => {
      if (!visible || frame) return
      frame = requestAnimationFrame(apply)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) apply()
      },
      { rootMargin: '200px 0px' },
    )

    io.observe(el)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [factor, template, clamp])

  return ref
}
