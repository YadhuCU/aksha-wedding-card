import { useEffect } from 'react'

/* Anything here means the guest has taken over — never `scroll`, which we
 * cause ourselves. */
const TAKEOVER_EVENTS = ['wheel', 'touchstart', 'touchmove', 'pointerdown', 'keydown']

/**
 * Walks the page down at a slow, steady reading pace once `active` turns true.
 *
 * Driven frame by frame rather than with one long `scroll-behavior: smooth`
 * jump: the card grows as photos decode, so the target keeps moving, and a
 * per-frame step also lets the guest interrupt at any moment. The first touch,
 * scroll or keypress stops it for good — resuming under someone who has
 * started reading is worse than not scrolling at all.
 */
export function useAutoScroll(active, { pixelsPerSecond = 30, startDelayMs = 1400 } = {}) {
  useEffect(() => {
    if (!active) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    let startTimer = 0
    let stopped = false
    let position = 0
    let lastFrameAt = 0

    const stop = () => {
      if (stopped) return
      stopped = true
      if (frame) cancelAnimationFrame(frame)
      if (startTimer) clearTimeout(startTimer)
      TAKEOVER_EVENTS.forEach((event) => window.removeEventListener(event, stop))
    }

    const step = (now) => {
      if (stopped) return

      /* Clamp the delta so a backgrounded tab does not lurch on return. */
      const elapsed = Math.min(100, now - lastFrameAt) / 1000
      lastFrameAt = now

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      position = Math.min(maxScroll, position + pixelsPerSecond * elapsed)

      /* 'instant' matters: the global `scroll-behavior: smooth` would other-
       * wise animate every single frame and fight itself. */
      window.scrollTo({ top: position, behavior: 'instant' })

      if (position >= maxScroll - 1) {
        stop()
        return
      }
      frame = requestAnimationFrame(step)
    }

    const begin = () => {
      if (stopped) return
      position = window.scrollY
      lastFrameAt = performance.now()
      frame = requestAnimationFrame(step)
    }

    startTimer = setTimeout(begin, startDelayMs)
    TAKEOVER_EVENTS.forEach((event) =>
      window.addEventListener(event, stop, { passive: true }),
    )

    return stop
  }, [active, pixelsPerSecond, startDelayMs])
}
