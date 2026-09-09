import { useEffect, useRef, useState } from 'react'
import { EnvelopeCover } from './components/EnvelopeCover'
import { InvitationCard } from './components/InvitationCard'
import { MusicPlayer } from './components/MusicPlayer'
import { useAutoScroll } from './hooks/useAutoScroll'
import { invitation } from './data/invitation'

/** `?to=Name` personalises the envelope greeting for a specific guest. */
function guestNameFromUrl() {
  const value = new URLSearchParams(window.location.search).get('to')
  return value ? value.trim().slice(0, 60) : ''
}

export default function App() {
  const [opened, setOpened] = useState(false)
  const [guestName] = useState(guestNameFromUrl)
  const musicRef = useRef(null)

  const { autoScroll } = invitation
  useAutoScroll(opened && autoScroll.enabled, {
    pixelsPerSecond: autoScroll.pixelsPerSecond,
    startDelayMs: autoScroll.startDelayMs,
  })

  /* Lock the page behind the envelope until it is opened. */
  useEffect(() => {
    document.body.style.overflow = opened ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [opened])

  return (
    <>
      <InvitationCard />

      {!opened && (
        <EnvelopeCover
          guestName={guestName}
          /* Fired inside the click itself, so the browser allows playback. */
          onBegin={() => musicRef.current?.start()}
          onOpen={() => setOpened(true)}
        />
      )}

      <MusicPlayer ref={musicRef} visible={opened} />
    </>
  )
}
