import { useState } from 'react'
import { SectionTitle } from '../SectionTitle'
import { useReveal } from '../../hooks/useReveal'
import { submitToSheet } from '../../lib/sheet'
import { invitation, theme } from '../../data/invitation'

/**
 * Guests write a wish; it is appended to the couple's Google Sheet the moment
 * they press send. Nothing is kept in the browser and nothing is shown on the
 * page — only the couple reads the wishes, in the sheet.
 *
 * Because delivery happens over the network, a failure is invisible unless we
 * say so: the error state is explicit and keeps the guest's text so they can
 * retry without retyping it.
 *
 * With no endpoint configured the whole section is hidden, rather than
 * offering a button that goes nowhere.
 */
export function Guestbook() {
  const { copy, guestbook, sheet, bride, groom } = invitation
  const [form, setForm] = useState({ name: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const reveal = useReveal()

  if (!guestbook.enabled || !sheet.endpoint) return null

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.message.trim()) return

    setStatus('sending')
    try {
      await submitToSheet({
        kind: 'wish',
        name: form.name.trim(),
        message: form.message.trim(),
      })
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  const field =
    'w-full rounded-md border bg-transparent px-3 py-2 text-[15px] outline-none focus:ring-1 disabled:opacity-60'
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

        {status === 'sent' ? (
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
                {bride.shortName} &amp; {groom.shortName} will read every one.
              </span>
            </p>

            <button
              type="button"
              onClick={() => {
                setForm({ name: '', message: '' })
                setStatus('idle')
              }}
              className="text-[12px] underline decoration-1 underline-offset-4 transition-opacity hover:opacity-70"
              style={{ color: theme.secondary, fontFamily: 'var(--f-sans)' }}
            >
              Write another
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mx-auto flex max-w-[420px] flex-col gap-3">
            <input
              required
              maxLength={80}
              disabled={status === 'sending'}
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={field}
              style={fieldStyle}
            />
            <textarea
              required
              rows={3}
              maxLength={1000}
              disabled={status === 'sending'}
              placeholder="Your wishes for the couple"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className={`${field} resize-none`}
              style={fieldStyle}
            />

            {status === 'error' && (
              <p
                className="rounded-md border px-3 py-2 text-center text-[12px]"
                style={{
                  borderColor: theme.primary,
                  color: theme.primary,
                  fontFamily: 'var(--f-sans)',
                }}
              >
                That didn&rsquo;t send. Please check your connection and try again —
                your words are still here.
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="mx-auto inline-flex items-center justify-center rounded-full px-7 py-2 text-[13px] tracking-wider uppercase transition-transform hover:scale-[1.03] disabled:scale-100 disabled:opacity-70 md:text-[15px]"
              style={{
                backgroundColor: theme.primary,
                color: '#ffffff',
                fontFamily: 'var(--f-title)',
              }}
            >
              {status === 'sending'
                ? 'Sending…'
                : status === 'error'
                  ? 'Try again'
                  : 'Send wishes'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
