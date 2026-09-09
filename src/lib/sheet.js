import { invitation } from '../data/invitation'

/**
 * Posts a submission to the Google Apps Script Web App, which appends it to
 * the spreadsheet.
 *
 * The Content-Type is deliberately `text/plain`. That keeps this a CORS
 * "simple request" so the browser sends no preflight — Apps Script cannot
 * answer an OPTIONS preflight, so `application/json` would be rejected
 * before the POST ever left.
 *
 * Resolves `{ confirmed }`. `confirmed: false` means the row was very likely
 * written but the browser would not let us read the reply, so we could not
 * verify it. Rejects only when the request itself could not be delivered.
 */
export async function submitToSheet(payload) {
  const { endpoint, token } = invitation.sheet

  if (!endpoint) throw new Error('No sheet endpoint configured')

  const body = JSON.stringify({ ...payload, token })
  const headers = { 'Content-Type': 'text/plain;charset=utf-8' }

  try {
    const response = await fetch(endpoint, { method: 'POST', headers, body })

    /* Apps Script answers via a redirect to googleusercontent.com; if that
     * hop's CORS headers come through we get a readable result. */
    if (!response.ok) throw new Error(`Sheet responded ${response.status}`)

    const result = await response.json()
    if (!result.ok) throw new Error(result.error || 'Sheet rejected the entry')

    return { confirmed: true }
  } catch (error) {
    /* A CORS failure is indistinguishable from a network failure here, so
     * retry opaquely: the POST still reaches Apps Script and the row is
     * still appended, we just cannot see the response to prove it. */
    try {
      await fetch(endpoint, { method: 'POST', mode: 'no-cors', headers, body })
      return { confirmed: false }
    } catch {
      throw error
    }
  }
}
