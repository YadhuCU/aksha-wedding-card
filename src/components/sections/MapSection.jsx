import { GoldLine } from '../GoldLine'
import { useReveal } from '../../hooks/useReveal'
import { invitation, theme } from '../../data/invitation'

export function MapSection() {
  const { venue } = invitation
  const reveal = useReveal()

  const embed = `https://www.google.com/maps?q=${encodeURIComponent(
    venue.embedQuery,
  )}&output=embed`

  return (
    <div className="relative isolate z-10 w-full pt-[9%] md:pt-[5%]">
      <div
        ref={reveal}
        className="reveal relative z-10 flex w-full flex-col items-center"
      >
        <div
          className="relative flex w-full flex-col gap-3 px-[10%] pb-6 md:px-[14%]"
          style={{ fontFamily: 'var(--f-serif)' }}
        >
          <h2
            className="text-center text-[18px] font-bold tracking-[0.04em] uppercase md:text-[24px]"
            style={{ color: theme.primary }}
          >
            {venue.name}
          </h2>

          <p
            className="mx-auto mt-1 flex max-w-[260px] flex-col items-center text-center text-[12px] whitespace-pre-line md:max-w-[400px] md:text-[14px]"
            style={{ color: theme.secondary }}
          >
            {venue.address}
          </p>

          <div
            className="mt-3 h-[250px] w-full overflow-hidden rounded-[15px] md:h-[330px]"
            style={{ border: `1px solid ${theme.secondary}` }}
          >
            <iframe
              title={`Map to ${venue.name}`}
              src={embed}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <a
            href={venue.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto inline-flex items-center gap-1.5 text-[13px] underline decoration-1 underline-offset-4 transition-opacity hover:opacity-70 md:text-[15px]"
            style={{ color: theme.secondary, fontFamily: 'var(--f-title)' }}
          >
            Open in Google Maps
          </a>
        </div>

        <GoldLine className="mt-2 md:mt-4" />
      </div>
    </div>
  )
}
