import { useEffect, useState } from 'react'
import { invitation, theme } from '../data/invitation'
import { longDate } from '../lib/date'

/**
 * RSVP has no server behind it. Submitting composes the reply and hands it
 * to WhatsApp when a number is configured in src/data/invitation.js, and
 * otherwise just confirms on screen so the flow is never a dead end.
 */
export function Rsvp() {
  const { rsvp, bride, groom, date, whatsAppNumber } = invitation
  const [open, setOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', attending: 'yes', guests: 1, note: '' })

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  if (!rsvp.enabled) return null

  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return

    const lines = [
      `RSVP — ${bride.shortName} & ${groom.shortName}, ${longDate(date)}`,
      `Name: ${form.name.trim()}`,
      form.attending === 'yes'
        ? `Attending: Yes (${form.guests} ${form.guests === 1 ? 'guest' : 'guests'})`
        : 'Attending: Unable to make it',
      form.note.trim() ? `Note: ${form.note.trim()}` : null,
    ].filter(Boolean)

    if (whatsAppNumber) {
      window.open(
        `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(lines.join('\n'))}`,
        '_blank',
        'noopener,noreferrer',
      )
    }
    setSent(true)
    setOpen(false)
  }

  const field =
    'w-full rounded-md border bg-transparent px-3 py-2 text-[15px] outline-none focus:ring-1'

  return (
    <div className="relative z-10 mt-7 flex w-full flex-col items-center justify-center md:mt-9">
      {sent ? (
        <p
          className="rounded-md border px-5 py-3 text-center text-[14px]"
          style={{
            borderColor: theme.softLine,
            backgroundColor: '#fbf1e2',
            color: theme.primary,
            fontFamily: 'var(--f-serif)',
          }}
        >
          Thank you — your response has been noted.
        </p>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center rounded-full px-7 py-2 text-[13px] tracking-wider uppercase transition-transform hover:scale-[1.03] md:text-[15px]"
          style={{
            backgroundColor: theme.primary,
            color: '#ffffff',
            fontFamily: 'var(--f-serif)',
          }}
        >
          {invitation.copy.rsvpButton}
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="RSVP"
          className="fixed inset-0 z-[250] flex items-center justify-center bg-black/50 px-5"
          onClick={() => setOpen(false)}
        >
          <form
            onSubmit={submit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[380px] rounded-xl border p-6 shadow-2xl"
            style={{
              backgroundColor: theme.background,
              borderColor: theme.softLine,
              color: theme.primary,
              fontFamily: 'var(--f-serif)',
            }}
          >
            <h2
              className="mb-4 text-center text-[18px] font-bold tracking-[0.04em] uppercase"
              style={{ fontFamily: 'var(--f-title)' }}
            >
              Will you join us?
            </h2>

            <label className="mb-3 block">
              <span className="mb-1 block text-[12px] uppercase" style={{ color: theme.secondary }}>
                Your name
              </span>
              <input
                required
                autoFocus
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={field}
                style={{ borderColor: theme.secondary, color: theme.primary }}
              />
            </label>

            <fieldset className="mb-3">
              <legend className="mb-1 text-[12px] uppercase" style={{ color: theme.secondary }}>
                Can you make it?
              </legend>
              <div className="flex gap-2">
                {[
                  ['yes', 'Joyfully accept'],
                  ['no', 'With regret'],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm({ ...form, attending: value })}
                    className="flex-1 rounded-md border px-3 py-2 text-[13px] transition-colors"
                    style={
                      form.attending === value
                        ? { backgroundColor: theme.primary, color: '#fff', borderColor: theme.primary }
                        : { borderColor: theme.secondary, color: theme.primary }
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>

            {form.attending === 'yes' && (
              <label className="mb-3 block">
                <span className="mb-1 block text-[12px] uppercase" style={{ color: theme.secondary }}>
                  Number of guests
                </span>
                <input
                  type="number"
                  min={1}
                  max={rsvp.maxGuests}
                  value={form.guests}
                  onChange={(e) =>
                    setForm({ ...form, guests: Math.max(1, Number(e.target.value) || 1) })
                  }
                  className={field}
                  style={{ borderColor: theme.secondary, color: theme.primary }}
                />
              </label>
            )}

            <label className="mb-5 block">
              <span className="mb-1 block text-[12px] uppercase" style={{ color: theme.secondary }}>
                A note (optional)
              </span>
              <textarea
                rows={2}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                className={`${field} resize-none`}
                style={{ borderColor: theme.secondary, color: theme.primary }}
              />
            </label>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-full border px-4 py-2 text-[13px] uppercase"
                style={{ borderColor: theme.secondary, color: theme.secondary }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-full px-4 py-2 text-[13px] tracking-wider uppercase"
                style={{ backgroundColor: theme.primary, color: '#ffffff' }}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
