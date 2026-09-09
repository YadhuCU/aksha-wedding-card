import { useState } from 'react'
import { SectionTitle } from '../SectionTitle'
import { useReveal } from '../../hooks/useReveal'
import { invitation, theme } from '../../data/invitation'

/**
 * Guests write a wish and send it to the couple over WhatsApp.
 *
 * There is no server and nothing is stored. Tapping the button hands the
 * composed message to WhatsApp on the guest's own phone, so the wish arrives
 * as a normal chat message the couple can reply to — and it costs nothing to
 * run. Wishes are never displayed on the page; only the couple reads them.
 *
 * With no number configured the whole section is hidden, rather than offering
 * a button that goes nowhere.
 */
export function Guestbook() {
  const { copy, guestbook, whatsAppNumber, bride, groom } = invitation
  const [form, setForm] = useState({ name: '', message: '' })
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState(false)
  const reveal = useReveal()

  if (!guestbook.enabled || !whatsAppNumber) return null

  const composed = () =>
    [
      `Wishes for ${bride.shortName} & ${groom.shortName}`,
      '',
      `From: ${form.name.trim()}`,
      '',
      form.message.trim(),
    ].join('\n')

  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.message.trim()) return

    const url = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(composed())}`

    /* A synthesised link rather than window.open: with 'noopener' that call
     * returns null even on success, so there is no way to tell a blocked
     * popup from an opened one. A new tab also keeps the invitation and its
     * music alive behind WhatsApp. If it is blocked outright, the guest still
     * has the copy-the-message fallback below. */
    const link = document.createElement('a')
    link.href = url
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    document.body.appendChild(link)
    link.click()
    link.remove()

    setSent(true)
  }

  /* For anyone without WhatsApp, or if the hand-off is blocked. */
  const copyInstead = async () => {
    try {
      await navigator.clipboard.writeText(composed())
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  const field =
    'w-full rounded-md border bg-transparent px-3 py-2 text-[15px] outline-none focus:ring-1'
  const fieldStyle = {
    borderColor: theme.secondary,
    color: theme.primary,
    fontFamily: 'var(--f-sans)',
  }

  return (
    <section className="relative isolate z-10">
      <div
        ref={reveal}
        className="reveal relative z-10 px-[9%] pt-[6%] pb-[5%] md:px-[14%]"
        style={{ color: theme.secondary, fontFamily: 'var(--f-serif)' }}
      >
        <SectionTitle className="mb-2">{copy.guestbookTitle}</SectionTitle>

        <p
          className="mx-auto mb-5 max-w-[420px] text-center text-[12px] md:text-[14px]"
          style={{ color: theme.secondary, fontFamily: 'var(--f-sans)' }}
        >
          {copy.guestbookSubtitle}
        </p>

        {sent ? (
          <div className="mx-auto flex max-w-[420px] flex-col items-center gap-3">
            <p
              className="w-full rounded-md border px-4 py-3 text-center text-[13px]"
              style={{
                borderColor: theme.softLine,
                backgroundColor: '#fbf1e2',
                color: theme.primary,
              }}
            >
              Thank you for your kind words!
              <span
                className="mt-1 block text-[11px]"
                style={{ color: theme.secondary, fontFamily: 'var(--f-sans)' }}
              >
                Send the message in WhatsApp to finish.
              </span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <button
                type="button"
                onClick={copyInstead}
                className="text-[12px] underline decoration-1 underline-offset-4 transition-opacity hover:opacity-70"
                style={{ color: theme.secondary, fontFamily: 'var(--f-sans)' }}
              >
                {copied ? 'Copied to clipboard' : "WhatsApp didn't open? Copy the message"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setForm({ name: '', message: '' })
                  setSent(false)
                  setCopied(false)
                }}
                className="text-[12px] underline decoration-1 underline-offset-4 transition-opacity hover:opacity-70"
                style={{ color: theme.secondary, fontFamily: 'var(--f-sans)' }}
              >
                Write another
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="mx-auto flex max-w-[420px] flex-col gap-3">
            <input
              required
              maxLength={60}
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={field}
              style={fieldStyle}
            />
            <textarea
              required
              rows={3}
              maxLength={600}
              placeholder="Your wishes for the couple"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className={`${field} resize-none`}
              style={fieldStyle}
            />
            <button
              type="submit"
              className="mx-auto inline-flex items-center justify-center gap-2 rounded-full px-7 py-2 text-[13px] tracking-wider uppercase transition-transform hover:scale-[1.03] md:text-[15px]"
              style={{
                backgroundColor: theme.primary,
                color: '#ffffff',
                fontFamily: 'var(--f-title)',
              }}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.06c-.25.7-1.44 1.34-1.98 1.39-.54.05-1.04.24-3.51-.73-2.98-1.17-4.86-4.24-5-4.44-.15-.2-1.19-1.59-1.19-3.03s.75-2.15 1.02-2.44c.27-.3.59-.37.79-.37.2 0 .4 0 .57.01.18.01.43-.7.67.51.25.59.84 2.03.91 2.18.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.38-.44.51-.15.15-.3.31-.13.61.17.3.76 1.25 1.62 2.03 1.11 1 2.05 1.31 2.35 1.46.3.15.47.13.65-.08.17-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.71.81 2.01.96.3.15.5.22.57.35.07.12.07.72-.18 1.42z" />
              </svg>
              Send on WhatsApp
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
