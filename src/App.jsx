import { useEffect, useState } from 'react'
import { EnvelopeCover } from './components/EnvelopeCover'
import { InvitationCard } from './components/InvitationCard'
import { MusicPlayer } from './components/MusicPlayer'
import { invitation } from './data/invitation'

/** `?to=Name` personalises the envelope greeting for a specific guest. */
function guestNameFromUrl() {
  const value = new URLSearchParams(window.location.search).get('to')
  return value ? value.trim().slice(0, 60) : ''
}

export default function App() {
  const [opened, setOpened] = useState(false)
  const [music, setMusic] = useState(false)
  const [guestName] = useState(guestNameFromUrl)

  /* Lock the page behind the envelope until it is opened. */
  useEffect(() => {
    document.body.style.overflow = opened ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [opened])

  const open = () => {
    setOpened(true)
    if (invitation.music.src) setMusic(true)
  }

  return (
    <>
      <InvitationCard />
      {!opened && <EnvelopeCover onOpen={open} guestName={guestName} />}
      {opened && <MusicPlayer playing={music} onToggle={() => setMusic((m) => !m)} />}
    </>
  )
}
