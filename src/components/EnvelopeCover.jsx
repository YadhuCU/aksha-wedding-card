import { useCallback, useMemo, useRef, useState } from 'react'
import { decor, invitation, theme } from '../data/invitation'
import { longDate } from '../lib/date'

const PARTICLE_COLORS = ['#d8407a', '#e0698f', '#ab7a45', '#f7e3cd']

/* A five-petal bougainvillea blossom, drawn so it reads at 12px. */
function Petal({ color, size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="12"
          cy="6.5"
          rx="3.4"
          ry="5.5"
          transform={`rotate(${deg} 12 12)`}
        />
      ))}
      <circle cx="12" cy="12" r="2.1" fill="#f7e3cd" opacity="0.85" />
    </svg>
  )
}

/** Deterministic RNG so the ambient drift is stable across re-renders. */
function seeded(seed) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * The sealed envelope shown before the invitation.
 *
 * Opening runs three overlapping beats: the wax seal cracks and rings out,
 * the corner flower sprays rush toward the viewer, and the card itself
 * lifts off the top of the screen — then `onOpen` hands over to the card.
 */
export function EnvelopeCover({ onOpen, guestName }) {
  const { bride, groom, brideFirst, copy, date } = invitation
  const first = brideFirst ? bride : groom
  const second = brideFirst ? groom : bride

  const [phase, setPhase] = useState('idle') // idle | opening | away
  const [burst, setBurst] = useState([])
  const handedOver = useRef(false)

  /* Slow bougainvillea drift behind the card. */
  const ambient = useMemo(() => {
    const rand = seeded(0x9e3779b9)
    return Array.from({ length: 12 }, (_, id) => ({
      id,
      left: 5 + 90 * rand(),
      size: 10 + 14 * rand(),
      color: PARTICLE_COLORS[Math.floor(rand() * PARTICLE_COLORS.length)],
      duration: 18 + 8 * rand(),
      delay: -rand() * 20,
      sway: `${(rand() * 60 - 30).toFixed(0)}px`,
    }))
  }, [])

  const makeBurst = useCallback(() => {
    const rand = seeded(0x811c9dc5)
    return Array.from({ length: 18 }, (_, id) => {
      const angle = rand() * Math.PI * 2
      const distance = 90 + rand() * 160
      return {
        id,
        size: 10 + rand() * 12,
        color: PARTICLE_COLORS[Math.floor(rand() * PARTICLE_COLORS.length)],
        dx: `${Math.cos(angle) * distance}px`,
        dy: `${Math.sin(angle) * distance - 40}px`,
        rotEnd: `${Math.round(rand() * 540 - 270)}deg`,
        delay: rand() * 0.15,
      }
    })
  }, [])

  const open = useCallback(() => {
    if (phase !== 'idle') return
    setPhase('opening')
    setBurst(makeBurst())
    window.setTimeout(() => setPhase('away'), 500)
    window.setTimeout(() => {
      if (handedOver.current) return
      handedOver.current = true
      onOpen()
    }, 1300)
  }, [phase, makeBurst, onOpen])

  const breaking = phase !== 'idle'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden px-4"
      style={{
        background: `linear-gradient(to bottom right, rgba(100,14,27,0.86), rgba(140,45,45,0.82), rgba(171,122,69,0.80)), url(${decor.paper}) center / cover`,
      }}
    >
      {/* Ambient falling blossoms */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {ambient.map((p) => (
          <span
            key={p.id}
            className="absolute top-0"
            style={{
              left: `${p.left}%`,
              '--sway': p.sway,
              animation: `ambient-fall ${p.duration}s linear ${p.delay}s infinite`,
            }}
          >
            <Petal color={p.color} size={p.size} />
          </span>
        ))}
      </div>

      <div
        className="relative w-[310px] sm:w-[340px] md:w-[520px] lg:w-[600px]"
        style={
          phase === 'away'
            ? { animation: 'envelope-away 800ms cubic-bezier(0.4, 0, 1, 1) forwards' }
            : undefined
        }
      >
        {/* Wax seal */}
        <div
          className="absolute left-1/2 z-30 flex items-center justify-center rounded-full"
          style={{
            top: '50px',
            width: '56px',
            height: '56px',
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle at 30% 30%, ${theme.primary}, #460010)`,
            '--shadow-color': 'rgba(100, 14, 27, 0.5)',
            boxShadow:
              '0 4px 20px rgba(100, 14, 27, 0.5), inset 0 2px 4px rgba(255,255,255,0.3)',
            animation: breaking
              ? 'seal-break 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards'
              : 'seal-pulse 2s ease-in-out infinite',
          }}
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7" style={{ fill: '#ffffff' }}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

        {breaking && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 rounded-full"
            style={{
              top: '50px',
              width: '56px',
              height: '56px',
              transform: 'translate(-50%, -50%)',
              border: `3px solid ${theme.primary}`,
              zIndex: 29,
              animation: 'seal-ring 0.6s ease-out forwards',
            }}
          />
        )}

        {/* Burst of petals from the broken seal */}
        {breaking && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 z-40"
            style={{ top: '50px' }}
          >
            {burst.map((p) => (
              <span
                key={p.id}
                className="absolute"
                style={{
                  '--dx': p.dx,
                  '--dy': p.dy,
                  '--rot-end': p.rotEnd,
                  animation: `particle-burst 1.1s ease-out ${p.delay}s forwards`,
                }}
              >
                <Petal color={p.color} size={p.size} />
              </span>
            ))}
          </div>
        )}

        {/* Card */}
        <div
          className="relative rounded-lg"
          style={{
            boxShadow:
              '0 25px 60px -12px rgba(0, 0, 0, 0.45), 0 8px 24px rgba(0, 0, 0, 0.2), 0 0 40px rgba(171, 122, 69, 0.15)',
          }}
        >
          <div
            className="absolute inset-0 overflow-hidden rounded-lg"
            style={{
              background: 'rgba(247, 227, 205, 0.98)',
              border: '1px solid rgba(171, 122, 69, 0.15)',
            }}
          >
            <img
              src={decor.flower1}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute top-0 left-0 w-[46%] max-w-[220px] -translate-x-[22%] -translate-y-[24%] -scale-x-100 md:w-[38%]"
            />
            <img
              src={decor.flower1}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 right-0 w-[42%] max-w-[200px] translate-x-[20%] translate-y-[18%] -scale-y-100 md:w-[34%]"
            />
            {breaking && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'radial-gradient(ellipse at center top, rgba(171,122,69,0.2) 0%, transparent 70%)',
                }}
              />
            )}
          </div>

          <div className="relative z-10 px-6 pt-28 pb-14 text-center md:pt-24 md:pb-10">
            <h1 className="mb-2 flex flex-col items-center leading-tight">
              <span
                className="block w-full text-center"
                style={{
                  fontFamily: 'var(--f-script)',
                  color: theme.primary,
                  fontSize: 'clamp(44px, 13vw, 76px)',
                }}
              >
                {first.shortName}
              </span>
              <span
                className="block w-full text-center leading-none"
                style={{ fontFamily: 'var(--f-brush)', color: theme.primary, fontSize: '26px' }}
              >
                &amp;
              </span>
              <span
                className="block w-full text-center"
                style={{
                  fontFamily: 'var(--f-script)',
                  color: theme.primary,
                  fontSize: 'clamp(44px, 13vw, 76px)',
                }}
              >
                {second.shortName}
              </span>
            </h1>

            <div className="mb-2 flex items-center justify-center gap-3">
              <div
                className="h-px w-10"
                style={{ background: `linear-gradient(to right, transparent, ${theme.secondary})` }}
              />
              <span className="text-sm" style={{ color: theme.secondary, opacity: 0.7 }}>
                ❦
              </span>
              <div
                className="h-px w-10"
                style={{ background: `linear-gradient(to left, transparent, ${theme.secondary})` }}
              />
            </div>

            <div
              className="mb-5 text-[18px]"
              style={{ color: 'rgba(100, 14, 27, 0.72)', fontFamily: 'var(--f-serif)' }}
            >
              {longDate(date)}
            </div>

            <div className="mb-6">
              <p
                className="mb-2 text-[18px] font-light"
                style={{ color: 'rgba(100, 14, 27, 0.72)', fontFamily: 'var(--f-serif)' }}
              >
                {copy.envelopeGreeting}
              </p>
              {guestName && (
                <div
                  className="mb-2 inline-block max-w-full rounded-xl px-5 py-2.5 [overflow-wrap:anywhere]"
                  style={{ backgroundColor: 'rgba(171, 122, 69, 0.10)' }}
                >
                  <h2
                    className="text-lg font-semibold sm:text-xl sm:font-medium"
                    style={{ color: theme.primary, fontFamily: 'var(--f-serif)' }}
                  >
                    {guestName}
                  </h2>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={open}
              aria-busy={breaking}
              className="relative mx-auto flex w-fit cursor-pointer items-center justify-center overflow-hidden rounded-full px-8 py-2.5 text-lg font-semibold shadow-lg select-none sm:font-medium"
              style={{
                backgroundColor: theme.primary,
                color: '#ffffff',
                boxShadow: '0 4px 14px rgba(100, 14, 27, 0.35)',
                fontFamily: 'var(--f-serif)',
              }}
            >
              {copy.openButton}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-0 h-full w-8"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                  animation: 'shine 3s ease-in-out infinite',
                }}
              />
            </button>
          </div>
        </div>

        {/* Corner sprays rush the viewer as the card lifts away */}
        {breaking &&
          [
            {
              cls: 'top-0 left-0 w-[46%] md:w-[38%] max-w-[220px] -translate-x-[22%] -translate-y-[24%]',
              flip: -1,
            },
            {
              cls: 'bottom-0 right-0 w-[42%] md:w-[34%] max-w-[200px] translate-x-[20%] translate-y-[18%]',
              flip: 1,
            },
          ].map((f, i) => (
            <div key={i} aria-hidden="true" className={`pointer-events-none absolute ${f.cls}`}>
              <img
                src={decor.flower1}
                alt=""
                className="pointer-events-none block h-auto w-full object-contain"
                style={{
                  '--fly-scale-x': f.flip,
                  animation: 'fly-forward 1.2s ease-in forwards',
                }}
              />
            </div>
          ))}
      </div>
    </div>
  )
}
