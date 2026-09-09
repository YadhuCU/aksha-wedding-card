import { useCallback, useEffect, useRef } from 'react'

/**
 * Adds `is-visible` the first time the element scrolls into view.
 *
 * Returns a callback ref rather than an object ref on purpose: a section may
 * render `null` on its first pass (the gallery waits for its photos to be
 * probed), so the node can attach long after mount. A callback ref starts
 * observing whenever the node actually arrives.
 */
export function useReveal(threshold = 0.12) {
  const observerRef = useRef(null)

  useEffect(
    () => () => {
      observerRef.current?.disconnect()
      observerRef.current = null
    },
    [],
  )

  return useCallback(
    (node) => {
      observerRef.current?.disconnect()
      observerRef.current = null
      if (!node) return

      /* Already on screen (or taller than the viewport) — reveal at once. */
      const rect = node.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        node.classList.add('is-visible')
        return
      }

      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            node.classList.add('is-visible')
            io.disconnect()
            observerRef.current = null
          }
        },
        { threshold, rootMargin: '0px 0px -8% 0px' },
      )

      io.observe(node)
      observerRef.current = io
    },
    [threshold],
  )
}
