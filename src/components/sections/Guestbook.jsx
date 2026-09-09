import { useEffect, useState } from 'react'
import { SectionTitle } from '../SectionTitle'
import { useReveal } from '../../hooks/useReveal'
import { invitation, theme } from '../../data/invitation'

const STORAGE_KEY = 'laxmi-yadu-guestbook'

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const save = (wishes) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes))
  } catch {
    /* private browsing / blocked storage — the wish still shows this session */
  }
}

/**
 * Wishes are kept in the visitor's own browser. There is no server, so a
 * wish is visible only to whoever wrote it — see README for wiring up a
 * shared backend when you want everyone's messages collected.
 */
export function Guestbook() {
  const { copy, guestbook } = invitation
  const [wishes, setWishes] = useState([])
  const [form, setForm] = useState({ name: '', message: '' })
  const [justSent, setJustSent] = useState(false)
  const reveal = useReveal()

  useEffect(() => setWishes(load()), [])

  if (!guestbook.enabled) return null

  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.message.trim()) return

    const next = [
      { id: Date.now(), name: form.name.trim(), message: form.message.trim() },
      ...wishes,
    ]
    setWishes(next)
    save(next)
    setForm({ name: '', message: '' })
    setJustSent(true)
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
        <SectionTitle className="mb-5">{copy.guestbookTitle}</SectionTitle>

        <form onSubmit={submit} className="mx-auto flex max-w-[420px] flex-col gap-3">
          <input
            required
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={field}
            style={fieldStyle}
          />
          <textarea
            required
            rows={3}
            placeholder="Your wishes for the couple"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className={`${field} resize-none`}
            style={fieldStyle}
          />
          <button
            type="submit"
            className="mx-auto inline-flex items-center justify-center rounded-full px-7 py-2 text-[13px] tracking-wider uppercase transition-transform hover:scale-[1.03] md:text-[15px]"
            style={{
              backgroundColor: theme.primary,
              color: '#ffffff',
              fontFamily: 'var(--f-title)',
            }}
          >
            Send wishes
          </button>
        </form>

        {justSent && (
          <p
            className="mx-auto mt-4 max-w-[420px] rounded-md border px-4 py-2.5 text-center text-[13px]"
            style={{
              borderColor: theme.softLine,
              backgroundColor: '#fbf1e2',
              color: theme.primary,
            }}
          >
            Thank you for your kind words!
          </p>
        )}

        <div className="mx-auto mt-6 flex max-w-[420px] flex-col gap-3">
          {wishes.length === 0 ? (
            <p className="text-center text-[13px]" style={{ color: theme.secondary }}>
              No wishes yet. Be the first!
            </p>
          ) : (
            wishes.map((w) => (
              <div
                key={w.id}
                className="rounded-md border p-4 text-sm"
                style={{
                  borderColor: theme.softLine,
                  backgroundColor: 'rgba(255,255,255,0.55)',
                }}
              >
                <p className="mb-1 font-semibold" style={{ color: theme.primary }}>
                  {w.name}
                </p>
                <p className="whitespace-pre-line" style={{ fontFamily: 'var(--f-sans)' }}>
                  {w.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
