import { useEffect, useRef, useState } from 'react'
import { invitation, theme } from '../data/invitation'

/**
 * Floating background-music toggle. Renders only when a track is configured
 * in src/data/invitation.js — browsers block autoplay until the visitor
 * interacts, so the envelope's Open tap is what starts playback.
 */
export function MusicPlayer({ playing, onToggle }) {
  const { music } = invitation
  const audioRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = music.volume
    if (playing) audio.play().then(() => setReady(true)).catch(() => setReady(false))
    else audio.pause()
  }, [playing, music.volume])

  if (!music.src) return null

  return (
    <>
      <audio ref={audioRef} src={music.src} loop preload="none" />
      <button
        type="button"
        onClick={onToggle}
        aria-label={playing && ready ? 'Pause music' : 'Play music'}
        className="fixed right-4 bottom-4 z-[220] flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105"
        style={{ backgroundColor: theme.primary, color: '#ffffff' }}
      >
        {playing && ready ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </>
  )
}
