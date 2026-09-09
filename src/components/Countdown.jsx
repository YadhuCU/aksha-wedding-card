import { useCountdown } from '../hooks/useCountdown'
import { theme } from '../data/invitation'

const UNITS = [
  ['days', 'days'],
  ['hours', 'hours'],
  ['minutes', 'minutes'],
  ['seconds', 'seconds'],
]

export function Countdown({ target, title }) {
  const t = useCountdown(target)
  if (t.isPast) return null

  return (
    <div className="mt-4 flex flex-col items-center justify-center">
      <h3
        className="flex flex-col items-center text-center text-[15px] tracking-[0.06em] uppercase md:text-[17px]"
        style={{ fontFamily: 'var(--f-serif)', color: theme.secondary }}
      >
        {title}
      </h3>
      <div
        className="mt-2 flex items-start justify-center gap-5 text-center md:gap-8"
        style={{ color: theme.secondary, fontFamily: 'var(--f-serif)' }}
      >
        {UNITS.map(([key, label]) => (
          <div key={key} className="flex min-w-[46px] flex-col items-center md:min-w-[60px]">
            <span
              className="text-[26px] leading-none tabular-nums md:text-[34px]"
              style={{ color: theme.primary }}
            >
              {String(t[key]).padStart(2, '0')}
            </span>
            <span className="mt-1 text-[11px] tracking-[0.14em] md:text-[13px]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
