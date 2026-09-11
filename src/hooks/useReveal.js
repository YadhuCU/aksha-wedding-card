import { useCallback } from 'react'

/**
 * Adds `is-visible` the first time the element scrolls into view.
 *
 * Returns a callback ref rather than an object ref: a section may render
 * `null` on its first pass (the gallery waits for its photos to be probed),
 * so the node can attach long after mount.
 *
 * Deliberately has no `useEffect`. StrictMode double-invokes effects in
 * development — mount, cleanup, mount — so a cleanup that disconnected the
 * observer tore down the live one moments after the ref had created it, and
 * nothing rebuilt it. Every section then stayed at `opacity: 0` in dev while
 * working in production. Keeping the observer on the node instead, and making
 * attachment idempotent, leaves nothing for StrictMode to unmake.
 */
export function useReveal(threshold = 0.12) {
  return useCallback(
    (node) => {
      if (!node || node.classList.contains('is-visible')) return

      /* Already on screen (or taller than the viewport) — reveal at once. */
      const rect = node.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        node.classList.add('is-visible')
        return
      }

      /* The ref can be re-attached; never stack observers on one node. */
      if (node._revealObserver) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return
          node.classList.add('is-visible')
          observer.disconnect()
          node._revealObserver = null
        },
        { threshold, rootMargin: '0px 0px -8% 0px' },
      )

      /* Parked on the node so its lifetime matches the element's, with no
       * effect cleanup for StrictMode to fire early. It disconnects itself
       * the moment the section reveals. */
      node._revealObserver = observer
      observer.observe(node)
    },
    [threshold],
  )
}
