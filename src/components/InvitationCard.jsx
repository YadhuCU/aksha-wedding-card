import { useEffect, useState } from 'react'
import { Hero } from './sections/Hero'
import { CeremonyInfo } from './sections/CeremonyInfo'
import { Gallery } from './sections/Gallery'
import { Celebration } from './sections/Celebration'
import { MapSection } from './sections/MapSection'
import { Guestbook } from './sections/Guestbook'
import { Footer } from './sections/Footer'
import { Lightbox } from './Lightbox'
import { decor, invitation, theme } from '../data/invitation'

/** Resolves which gallery files actually exist, so a gap never shows. */
function useAvailableImages(images) {
  const [available, setAvailable] = useState([])

  useEffect(() => {
    let cancelled = false

    Promise.all(
      images.map(
        (image) =>
          new Promise((resolve) => {
            const probe = new Image()
            probe.onload = () => resolve(image)
            probe.onerror = () => resolve(null)
            probe.src = image.src
          }),
      ),
    ).then((results) => {
      if (!cancelled) setAvailable(results.filter(Boolean))
    })

    return () => {
      cancelled = true
    }
  }, [images])

  return available
}

/**
 * The invitation itself: a single tall card, 480px on phones and 900px from
 * tablets up, laid over a paper texture that repeats down its whole length.
 */
export function InvitationCard() {
  const images = useAvailableImages(invitation.gallery)
  const [lightbox, setLightbox] = useState({ open: false, index: 0 })

  return (
    <div className="flex w-full justify-center overflow-x-clip overflow-clip bg-white scrollbar-none">
      <div
        className="relative isolate w-full max-w-[480px] overflow-hidden md:mx-auto md:max-w-[900px] md:border md:border-[#ab7a4533]"
        style={{ backgroundColor: theme.background, color: theme.secondary }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-20 mix-blend-darken"
          style={{
            backgroundImage: `url(${decor.paper})`,
            backgroundSize: '100% auto',
            backgroundRepeat: 'repeat-y',
            opacity: 0.4,
          }}
        />
        <Hero />
        <CeremonyInfo />
        <Celebration />
        <MapSection />
        <Gallery
          images={images}
          onImageClick={(index) => setLightbox({ open: true, index })}
        />
        <Guestbook />
        <Footer />
      </div>

      <Lightbox
        images={images}
        initialIndex={lightbox.index}
        isOpen={lightbox.open}
        onClose={() => setLightbox((l) => ({ ...l, open: false }))}
      />
    </div>
  )
}
