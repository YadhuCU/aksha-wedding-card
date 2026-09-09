/** Date/time helpers. All display uses the en-GB/en-US month + day names. */

/** "2026-10-25" + "10:30" -> local Date */
export function toDate(isoDate, time = '00:00') {
  const [y, m, d] = isoDate.split('-').map(Number)
  const [hh, mm] = time.split(':').map(Number)
  return new Date(y, m - 1, d, hh || 0, mm || 0, 0, 0)
}

export function dateParts(isoDate) {
  const dt = toDate(isoDate)
  return {
    day: String(dt.getDate()),
    dayPadded: String(dt.getDate()).padStart(2, '0'),
    month: String(dt.getMonth() + 1),
    year: String(dt.getFullYear()),
    dayName: dt.toLocaleDateString('en-US', { weekday: 'long' }),
    monthName: dt.toLocaleDateString('en-US', { month: 'long' }),
  }
}

/** 24h "10:30" -> "10:30 AM" */
export function formatTime(time) {
  const [hh, mm] = time.split(':').map(Number)
  const suffix = hh >= 12 ? 'PM' : 'AM'
  const h12 = hh % 12 === 0 ? 12 : hh % 12
  return `${h12}:${String(mm).padStart(2, '0')} ${suffix}`
}

/** "October 25, 2026" */
export function longDate(isoDate) {
  const { monthName, day, year } = dateParts(isoDate)
  return `${monthName} ${day}, ${year}`
}

const pad = (n) => String(n).padStart(2, '0')

/** Google Calendar "add event" URL, 4h event starting at the ceremony time. */
export function calendarUrl({ isoDate, time, title, details, location }) {
  const start = toDate(isoDate, time)
  const end = new Date(start.getTime() + 4 * 60 * 60 * 1000)
  const stamp = (d) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(
      d.getHours(),
    )}${pad(d.getMinutes())}00`

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${stamp(start)}/${stamp(end)}`,
    details: details ?? '',
    location: location ?? '',
    ctz: 'Asia/Kolkata',
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/** Month grid (6 rows x 7 cols, Sunday first) for the mini calendar. */
export function monthMatrix(year, month) {
  const first = new Date(year, month - 1, 1)
  const daysInMonth = new Date(year, month, 0).getDate()
  const lead = first.getDay()

  const cells = []
  for (let i = 0; i < lead; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  const weeks = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}
