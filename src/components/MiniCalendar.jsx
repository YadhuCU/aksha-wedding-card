import { monthMatrix } from '../lib/date'
import { theme } from '../data/invitation'

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

/** Month grid with the wedding day ringed, sized to sit inside the gold frame. */
export function MiniCalendar({ year, month, day }) {
  const weeks = monthMatrix(year, month)
  const monthName = new Date(year, month - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
  })

  return (
    <div className="flex w-full flex-col items-center" style={{ color: theme.primary }}>
      <div
        className="mb-1 text-[15px] font-bold md:mb-2 md:text-[18px]"
        style={{ fontFamily: 'var(--f-title)' }}
      >
        {monthName} {year}
      </div>

      <table
        className="w-full border-separate border-spacing-y-[1px] text-center"
        style={{ fontFamily: 'var(--f-serif)' }}
      >
        <thead>
          <tr>
            {WEEKDAYS.map((d) => (
              <th
                key={d}
                scope="col"
                className="pb-1 text-[9px] font-normal tracking-[0.06em] uppercase md:text-[12px]"
                style={{ color: theme.secondary }}
              >
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((d, di) => {
                const isDay = d === day
                return (
                  <td key={di} className="p-0">
                    <span
                      className={`mx-auto flex h-[18px] w-[18px] items-center justify-center rounded-full text-[10px] tabular-nums md:h-[26px] md:w-[26px] md:text-[13px] ${
                        isDay ? 'font-bold text-white' : ''
                      }`}
                      style={isDay ? { backgroundColor: theme.primary } : undefined}
                      aria-current={isDay ? 'date' : undefined}
                    >
                      {d ?? ''}
                    </span>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
