import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { invitation, theme } from '../data/invitation'

/**
 * Background music, played as a loop of one stretch of the track.
 *
 * The <audio> element is mounted from the very first render — before the
 * envelope is opened — because browsers only permit playback that starts
 * inside a real user gesture. `start()` is therefore called synchronously
 * from the Open tap; anything deferred to an effect risks being blocked.
 *
 * Renders nothing at all when no track is configured.
 */
export const MusicPlayer = forwardRef(function MusicPlayer({ visible }, ref) {
  const { music } = invitation
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  const startTime = music.startTime ?? 0
  const endTime = music.endTime ?? null

  /* Seeking only works once metadata has arrived. */
  const seekToStart = (audio) => {
    if (audio.readyState >= 1) {
      audio.currentTime = startTime
      return
    }
    audio.addEventListener(
      'loadedmetadata',
      () => {
        audio.currentTime = startTime
      },
      { once: true },
    )
    audio.load()
  }

  useImperativeHandle(ref, () => ({
    /** Begin the loop at `startTime`. Must be called inside a user gesture. */
    start() {
      const audio = audioRef.current
      if (!audio) return
      seekToStart(audio)
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false))
    },
  }))

  useEffect(() => {
    const audio = audioRef.current
    if (audio) audio.volume = music.volume
  }, [music.volume])

  /* Wrap back to `startTime` instead of playing on past the chosen stretch. */
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || endTime === null) return

    const onTimeUpdate = () => {
      if (audio.currentTime >= endTime) audio.currentTime = startTime
    }

    audio.addEventListener('timeupdate', onTimeUpdate)
    return () => audio.removeEventListener('timeupdate', onTimeUpdate)
  }, [startTime, endTime])

  if (!music.src) return null

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return

    if (playing) {
      audio.pause()
      setPlaying(false)
      return
    }

    /* Resume where it left off, unless it never got going. */
    if (audio.currentTime < startTime) seekToStart(audio)
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false))
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={music.src}
        preload="metadata"
        loop={endTime === null}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      />

      {visible && (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? 'Pause music' : 'Play music'}
          className="fixed right-4 bottom-4 z-[220] flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105"
          style={{ backgroundColor: theme.primary, color: '#ffffff' }}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      )}
    </>
  )
})
