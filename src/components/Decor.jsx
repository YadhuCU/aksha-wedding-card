import { decor } from '../data/invitation'
import { useParallax } from '../hooks/useParallax'

/**
 * A purely decorative, absolutely positioned background image.
 * Position and width come from Tailwind classes so the whole composition
 * scales with the card, exactly like the reference layout.
 */
export function Decor({ src, aspect, className = '', style, parallax }) {
  const ref = useParallax(
    parallax?.factor ?? 0,
    parallax?.template ?? 'translateY({y})',
    parallax?.clamp ?? 120,
  )

  return (
    <div
      ref={parallax ? ref : undefined}
      aria-hidden="true"
      className={`pointer-events-none absolute bg-contain bg-center bg-no-repeat ${className}`}
      style={{
        ...(parallax ? { willChange: 'transform' } : null),
        aspectRatio: aspect,
        backgroundImage: `url(${src})`,
        ...style,
      }}
    />
  )
}

/** The faint sandstone palace that ghosts behind whole sections. */
export function CastleWatermark({ className = '', parallax }) {
  return (
    <Decor
      src={decor.castle2}
      aspect="1448/1086"
      className={`-z-10 opacity-10 ${className}`}
      parallax={parallax}
    />
  )
}
