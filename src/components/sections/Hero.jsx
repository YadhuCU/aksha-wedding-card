import { Decor } from '../Decor'
import { decor, invitation, theme } from '../../data/invitation'

/**
 * The opening panel: a scalloped Mughal arch with Ganesha above the couple's
 * names, standing on a sandstone palace flanked by bougainvillea.
 *
 * Every offset is a percentage of the card width, so the whole scene scales
 * as one drawing instead of drifting apart between breakpoints.
 */
export function Hero() {
  const { bride, groom, brideFirst } = invitation
  const first = brideFirst ? bride : groom
  const second = brideFirst ? groom : bride

  const nameStyle = {
    fontFamily: 'var(--f-script)',
    color: theme.primary,
    fontSize: 'clamp(30px, 12.5vw, 85px)',
  }

  return (
    <section
      dir="ltr"
      className="relative isolate w-full overflow-hidden pt-[13.2%] pb-[16.6%]"
    >
      <div className="relative mx-auto w-full max-w-[480px] md:max-w-[680px]">
        <Decor
          src={decor.bells}
          aspect="1086/1448"
          className="top-0 left-[1.4%] z-[2] mt-[-17.9%] w-[32.7%]"
        />
        <Decor
          src={decor.flower1}
          aspect="1"
          className="top-0 left-[40.6%] z-[3] mt-[-17.5%] w-[77.1%] md:top-[-5%] md:w-[90%]"
        />

        {/* Arch + names */}
        <div className="relative mx-auto w-[96.1%]" style={{ aspectRatio: '424/529' }}>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-contain bg-center bg-no-repeat opacity-[0.54]"
            style={{ backgroundImage: `url(${decor.archFrame})` }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-[20%] left-1/2 w-[13.7%] -translate-x-1/2 bg-contain bg-center bg-no-repeat"
            style={{ aspectRatio: '579/699', backgroundImage: `url(${decor.ganesha})` }}
          />
          <div className="absolute top-[43.9%] left-1/2 z-20 flex w-[68%] -translate-x-1/2 flex-col items-center gap-[1.2%] text-center leading-[1.15]">
            <div className="w-full">
              <span className="inline-block" style={nameStyle}>
                {first.shortName}
              </span>
            </div>
            <span
              className="block"
              style={{
                fontFamily: 'var(--f-brush)',
                color: theme.primary,
                fontSize: 'clamp(18px, 6.8vw, 47px)',
              }}
            >
              &amp;
            </span>
            <div className="w-full">
              <span className="inline-block" style={nameStyle}>
                {second.shortName}
              </span>
            </div>
          </div>
        </div>

        {/* Palace, garden wall and flowers, tucked under the arch */}
        <div className="relative z-0 mt-[-59.6%] w-full" style={{ aspectRatio: '441/546' }}>
          <Decor
            src={decor.sandstone}
            aspect="808/1402"
            className="top-0 left-[74.8%] z-[2] w-[55.8%]"
          />
          <Decor
            src={decor.castle}
            aspect="1635/962"
            className="top-[13.4%] left-[-25.9%] z-[1] w-[176.6%]"
          />
          <Decor
            src={decor.flower2}
            aspect="1"
            className="top-[60.6%] left-[54.6%] z-[4] w-[47.6%] md:left-[70%]"
          />
          <Decor
            src={decor.flower2}
            aspect="1"
            className="top-[60.6%] right-[54.6%] z-[4] w-[47.6%] md:right-[70%]"
            style={{ transform: 'scaleX(-1)' }}
          />
          <Decor
            src={decor.fence}
            aspect="1774/887"
            className="top-[75.5%] left-1/2 z-[3] w-[58.5%] -translate-x-1/2"
          />
        </div>
      </div>
    </section>
  )
}
