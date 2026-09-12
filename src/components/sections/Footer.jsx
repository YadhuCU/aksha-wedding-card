import { useReveal } from '../../hooks/useReveal'
import { decor, invitation, theme } from '../../data/invitation'

/**
 * Closing panel. The palace rises from the bottom edge behind the thank-you,
 * mirroring the hero so the card reads as one continuous landscape.
 */
export function Footer() {
  const { copy, bride, groom } = invitation
  const reveal = useReveal()

  return (
    <div className="relative isolate z-10">
      <footer
        ref={reveal}
        className="reveal relative z-20 flex flex-col items-center px-[9%] pb-[62%] text-center md:px-[14%] md:pb-[44%]"
      >
        {copy.thankYouNote && (
          <span
            className="mx-auto flex flex-col items-center gap-1 text-[11px] whitespace-pre-line md:max-w-[560px] md:text-[14px]"
            style={{ color: theme.primary, fontFamily: 'var(--f-sans)', fontWeight: 500 }}
          >
            {copy.thankYouNote}
          </span>
        )}

        <div className="mt-6 flex items-center justify-center gap-3 md:mt-8">
          <div
            className="h-px w-10"
            style={{ background: `linear-gradient(to right, transparent, ${theme.secondary})` }}
          />
          <span
            className="text-[26px] leading-none"
            style={{ color: theme.primary, fontFamily: 'var(--f-brush)' }}
          >
            {bride.shortName} &amp; {groom.shortName}
          </span>
          <div
            className="h-px w-10"
            style={{ background: `linear-gradient(to left, transparent, ${theme.secondary})` }}
          />
        </div>
      </footer>

      <img
        src={decor.castle}
        alt=""
        aria-hidden="true"
        loading="eager"
        decoding="async"
        className="pointer-events-none absolute bottom-[-15%] left-[-40.6%] z-0 h-auto w-[176.6%] max-w-none object-contain md:left-[-18%] md:w-[136%]"
      />
    </div>
  )
}
