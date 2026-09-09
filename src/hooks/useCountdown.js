import { useEffect, useState } from 'react'

const split = (ms) => ({
  days: Math.floor(ms / 86400000),
  hours: Math.floor((ms / 3600000) % 24),
  minutes: Math.floor((ms / 60000) % 60),
  seconds: Math.floor((ms / 1000) % 60),
})

/** Ticks once a second until `target`, then reports `isPast`. */
export function useCountdown(target) {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, target.getTime() - Date.now()),
  )

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(Math.max(0, target.getTime() - Date.now()))
    }, 1000)
    return () => clearInterval(id)
  }, [target])

  return { ...split(remaining), isPast: remaining <= 0 }
}
