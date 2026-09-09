import { CastleWatermark, Decor } from '../Decor'
import { GoldLine } from '../GoldLine'
import { SectionTitle } from '../SectionTitle'
import { useReveal } from '../../hooks/useReveal'
import { decor, invitation, theme } from '../../data/invitation'
import { dateParts, formatTime } from '../../lib/date'

function FamilySide({ person }) {
  return (
    <div className="row-span-4 grid min-w-0 max-w-[170px] grid-rows-subgrid justify-items-center text-center md:max-w-[270px]">
      <span
        className="mb-[2px] text-[12px] md:text-[15px]"
        style={{ color: theme.secondary }}
      >
        {person.parentTitle}
      </span>
      <span
        className="font-semibold [overflow-wrap:anywhere]"
        style={{ fontFamily: 'var(--f-serif)', color: theme.primary }}
      >
        {person.father}
      </span>
      <span
        className="font-semibold [overflow-wrap:anywhere]"
        style={{ fontFamily: 'var(--f-serif)', color: theme.primary }}
      >
        {person.mother}
      </span>
      <div
        className="mt-2 flex flex-col text-[10px] leading-snug whitespace-pre-line md:text-[12px]"
        style={{ color: theme.secondary, fontFamily: 'var(--f-sans)' }}
      >
        {person.address}
      </div>
    </div>
  )
}

/**
 * "Ceremony Info" — both families, the invitation line, the couple's full
 * names, and the date/time of the ceremony itself.
 */
export function CeremonyInfo() {
  const { bride, groom, brideFirst, copy, date, time } = invitation
  const first = brideFirst ? bride : groom
  const second = brideFirst ? groom : bride
  const { dayName, monthName, day, year } = dateParts(date)
  const reveal = useReveal()

  return (
    <section className="relative isolate z-10 w-full px-[8.5%] pt-[5.2%] md:px-[12%]">
      <CastleWatermark
        className="top-0 left-[-18.8%] mt-[12%] w-[244%] md:w-[170%]"
        parallax={{ factor: 0.1, clamp: 40 }}
      />
      <Decor
        src={decor.pattern}
        aspect="1302/253"
        className="top-0 left-[6.1%] z-[1] mt-[-9.5%] w-[87.5%]"
      />
      <Decor
        src={decor.sandstoneFlower}
        aspect="837/1843"
        className="top-0 left-[-40%] z-[1] mt-[15.6%] w-[56.7%] md:left-[-23%] md:w-[42%]"
        parallax={{ factor: 0.05 }}
      />
      <Decor
        src={decor.flower3}
        aspect="806/1254"
        className="top-0 left-[80%] z-[1] mt-[61%] w-[52.4%] md:w-[40%]"
        parallax={{ factor: -0.035 }}
      />

      <div ref={reveal} className="reveal relative z-10 flex flex-col gap-6 md:gap-8">
        <SectionTitle>{copy.ceremonyInfoTitle}</SectionTitle>

        <div
          className="grid w-full grid-cols-[1fr_auto_1fr] grid-rows-[repeat(4,auto)] justify-center gap-x-3 gap-y-1 md:gap-x-7"
          style={{ color: theme.primary, fontFamily: 'var(--f-serif)' }}
        >
          <FamilySide person={first} />
          <div
            className="row-span-4 h-[50px] w-px self-center md:h-[70px]"
            style={{ backgroundColor: theme.secondary, opacity: 0.6 }}
          />
          <FamilySide person={second} />
        </div>

        <div
          className="relative mx-auto flex flex-col gap-1 text-center text-[15px] uppercase md:max-w-[560px] md:text-[18px]"
          style={{ fontFamily: 'var(--f-serif)', color: theme.primary }}
        >
          {copy.announcement}
        </div>

        {/* The couple, in full */}
        <div className="relative flex w-full min-w-0 flex-col items-center gap-3 text-center md:gap-4">
          <div
            className="leading-[50px] md:leading-[68px]"
            style={{
              fontFamily: 'var(--f-garamond)',
              color: theme.primary,
              fontSize: 'clamp(24px, 9vw, 58px)',
            }}
          >
            {first.fullName}
          </div>
          <div
            className="text-[30px] md:text-[38px]"
            style={{ color: theme.primary, fontFamily: 'var(--f-garamond)' }}
          >
            &amp;
          </div>
          <div
            className="leading-[50px] md:leading-[68px]"
            style={{
              fontFamily: 'var(--f-garamond)',
              color: theme.primary,
              fontSize: 'clamp(24px, 9vw, 58px)',
            }}
          >
            {second.fullName}
          </div>
        </div>

        {/* Ceremony date / time */}
        <div className="relative w-full">
          <div
            className="flex flex-col items-center gap-2 text-center"
            style={{ fontFamily: 'var(--f-serif)' }}
          >
            <span
              className="text-[13px] tracking-[0.12em] uppercase md:text-[15px]"
              style={{ color: theme.secondary }}
            >
              {dayName}
            </span>
            <div className="flex items-center justify-center gap-4">
              <span
                className="text-[16px] uppercase md:text-[19px]"
                style={{ color: theme.secondary }}
              >
                {monthName}
              </span>
              <span
                className="flex items-center justify-center text-[20px] leading-none md:text-[26px]"
                style={{ fontFamily: 'var(--f-serif)', color: theme.secondary, opacity: 0.7 }}
              >
                |
              </span>
              <span
                className="text-[34px] leading-none md:text-[44px]"
                style={{ color: theme.primary }}
              >
                {day}
              </span>
              <span
                className="flex items-center justify-center text-[20px] leading-none md:text-[26px]"
                style={{ fontFamily: 'var(--f-serif)', color: theme.secondary, opacity: 0.7 }}
              >
                |
              </span>
              <span
                className="text-[16px] md:text-[19px]"
                style={{ color: theme.secondary }}
              >
                {year}
              </span>
            </div>
            <span
              className="text-[13px] tracking-[0.12em] uppercase md:text-[15px]"
              style={{ color: theme.secondary }}
            >
              At {formatTime(time)}
            </span>
          </div>
          <GoldLine className="mt-6 md:mt-8" widthClassName="w-[64.8%]" />
        </div>
      </div>
    </section>
  )
}
