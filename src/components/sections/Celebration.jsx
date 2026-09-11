import { CastleWatermark, Decor } from '../Decor'
import { SectionTitle } from '../SectionTitle'
import { Countdown } from '../Countdown'
import { MiniCalendar } from '../MiniCalendar'
import { Rsvp } from '../Rsvp'
import { useReveal } from '../../hooks/useReveal'
import { decor, invitation, theme } from '../../data/invitation'
import { calendarUrl, dateParts, formatTime, toDate } from '../../lib/date'

/**
 * "Celebration Party Info" — the mirrored twin of the ceremony panel: same
 * decor, flipped, so the two halves of the card answer each other.
 */
export function Celebration() {
  const { bride, groom, copy, date, time, venue } = invitation
  const { dayName, monthName, day, year, month } = dateParts(date)
  const reveal = useReveal()

  const target = toDate(date, time)
  const addToCalendar = calendarUrl({
    isoDate: date,
    time,
    title: `Wedding of ${bride.fullName} & ${groom.fullName}`,
    details: copy.announcement,
    location: venue.address.replace(/\n/g, ' '),
  })

  const divider = (
    <div className="h-6 w-px md:h-8" style={{ backgroundColor: theme.secondary }} />
  )

  return (
    <section className="relative isolate z-10 w-full px-[8%] pt-[13%] md:px-[12%] md:pt-[9%]">
      <CastleWatermark
        className="top-0 left-[-103.2%] mt-[71.7%] w-[244%] md:w-[170%]"
        parallax={{ factor: 0.1, template: 'translateY({y}) scaleX(-1)', clamp: 40 }}
      />
      <Decor
        src={decor.pattern}
        aspect="1302/253"
        className="top-0 left-[6.1%] z-[1] mt-[-5.9%] w-[87.5%]"
      />
      <Decor
        src={decor.sandstoneFlower}
        aspect="837/1843"
        className="top-0 left-[83%] z-[1] mt-[-6.1%] w-[56.7%] md:w-[42%]"
        parallax={{ factor: 0.05, template: 'translateY({y}) scaleX(-1)' }}
      />
      <Decor
        src={decor.flower3}
        aspect="806/1254"
        className="top-0 left-[-30%] z-[1] mt-[41%] w-[52.4%] md:top-[-15%] md:left-[-17%] md:w-[40%]"
        parallax={{ factor: -0.035, template: 'translateY({y}) scaleX(-1)' }}
      />

      <div
        ref={reveal}
        className="reveal relative z-10 flex w-full flex-col items-center"
      >
        {/* <SectionTitle>{copy.receptionInfoTitle}</SectionTitle> */}

        <div
          className="mt-6 flex w-full flex-col items-center gap-4 text-center md:mt-8"
          style={{ fontFamily: 'var(--f-serif)', color: theme.secondary }}
        >
          <h3
            className="flex flex-col items-center text-center text-[16px] tracking-[0.04em] uppercase md:text-[19px]"
            style={{ fontFamily: 'var(--f-serif)', color: theme.primary, fontWeight: 600 }}
          >
            {copy.receptionAt}
          </h3>

          <div className="text-[20px] md:text-[30px]" style={{ color: theme.secondary }}>
            {formatTime(time)}
          </div>

          <div className="flex items-center gap-6 text-[12px] uppercase md:text-[16px]">
            <span className="text-right">{dayName}</span>
            {divider}
            <span
              className="text-[30px] md:text-[40px]"
              style={{ color: theme.primary }}
            >
              {day}
            </span>
            {divider}
            <span className="text-left">{monthName}</span>
          </div>

          <div className="text-[18px] md:text-[24px]" style={{ color: theme.secondary }}>
            {year}
          </div>

          <Countdown target={target} title={copy.countdownTitle} />
        </div>

        {/* Framed month calendar */}
        <div
          className="relative mx-auto mt-8 w-full max-w-[330px] md:mt-10 md:max-w-[470px]"
          style={{ aspectRatio: '359/339' }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${decor.calendarFrame})` }}
          />
          <div className="relative flex h-full w-full items-center justify-center px-[11%] py-[9%]">
            <MiniCalendar year={Number(year)} month={Number(month)} day={Number(day)} />
          </div>
        </div>

        <div className="mt-3 flex justify-center">
          <a
            href={addToCalendar}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-[13px] underline decoration-1 underline-offset-4 transition-opacity hover:opacity-70 md:text-[15px]"
            style={{ color: theme.secondary, fontFamily: 'var(--f-title)' }}
          >
            {copy.addToCalendar}
          </a>
        </div>

        <Rsvp />
      </div>
    </section>
  )
}
