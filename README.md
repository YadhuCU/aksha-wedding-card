# Laxmi & Yadu — Save the Date

A save-the-date wedding site built with **React + Vite + Tailwind CSS**, recreating
the "Mahal Gold" invitation design: a sealed envelope that opens into a single
tall card of Rajasthani sandstone palaces, gold filigree and bougainvillea.

**Sunday, 25 October 2026 · 10:30 AM · Pinarayi Convention Centre, Kannur**

---

## Run it

```bash
npm install
npm run dev
```

```bash
npm run build
```

The build lands in `dist/` and is fully static — drop it on Netlify, Vercel,
GitHub Pages, or any web host. `vite.config.js` sets `base: './'`, so it also
works from a subfolder without changes.

---

## One thing still needs you

Two of your three photos were recovered and are in place. The third — the two
of you in the white saree and black shirt against the maroon door — could not be
downloaded, so **save that photo as `public/images/gallery/couple-2.jpg`**.

Until you do, the gallery simply shows the other three. Missing files are
detected up front and skipped, so nothing ever renders as a broken image.

| Slot | Photo |
| --- | --- |
| `couple-1.jpg` | Portrait — she is laughing up at him |
| `couple-2.jpg` | **Add this one** — maroon door, white saree |
| `couple-3.jpg` | Candid close-up, outdoors |
| `couple-4.jpg` | Reception, with the microphone |

Photos are shown at up to 1400px. Anything you add is best resized to match:

```bash
convert your-photo.jpg -auto-orient -resize '1400x1400>' -strip -quality 82 public/images/gallery/couple-2.jpg
```

---

## Editing the content

Everything you would want to change lives in one file: **`src/data/invitation.js`**.
Names, parents, addresses, the date and time, venue and map links, all section
headings and body copy, the gallery list, RSVP and music settings. No component
needs touching to reword the invitation.

### Personalised greeting

Append `?to=` to any link and the envelope addresses that guest by name:

```
https://your-site.com/?to=Suresh%20%26%20Family
```

### RSVP — currently off

The **Confirm** button is disabled. There is no server behind it, and with no
number configured it told guests "your response has been noted" while nothing
was recorded anywhere — worse than having no button at all.

To switch it on, add a WhatsApp number in international format (no `+` or
spaces) and flip the flag in `src/data/invitation.js`:

```js
rsvp: { enabled: true, whatsAppNumber: '919876543210', maxGuests: 10 }
```

The form then composes the reply and hands it to WhatsApp on submit. Guests
without WhatsApp are the gap here; a form service or a small backend in
`src/components/Rsvp.jsx` would cover everyone.

### Guestbook

Wishes are stored in **each visitor's own browser** (`localStorage`), so a guest
sees only what they themselves wrote. That is a real limitation, not an
oversight: collecting everyone's messages needs a backend. When you want that,
replace the `load`/`save` functions in `src/components/sections/Guestbook.jsx`
with calls to Firebase, Supabase or a form service — the rest of the component
is unchanged. Set `guestbook.enabled: false` to hide the section entirely.

### Auto-scroll

Once the envelope opens, the card walks itself down at a slow reading pace:

```js
autoScroll: { enabled: true, pixelsPerSecond: 30, startDelayMs: 1400 }
```

At 30 px/s the mobile card takes roughly **1 minute 50 seconds** end to end.
Lower the number to slow it further, or set `enabled: false` to turn it off.

It stops permanently on the guest's first wheel, swipe, tap or keypress — it
never resumes underneath someone who has started reading, and tapping a photo
or the music button ends it too. It also does nothing at all under
`prefers-reduced-motion: reduce`.

### Background music

Configured and working — `public/music/bgm.mp3` starts at **1:06** the moment
the envelope is opened, and loops the 1:06–3:32 stretch so it never plays back
into the intro:

```js
music: {
  src: './music/bgm.mp3',
  volume: 0.5,
  startTime: 66,  // 1:06
  endTime: 212,   // 3:32
}
```

Set `endTime: null` to loop the whole file, or `src: null` to remove the player
entirely. A floating play/pause button sits bottom-right once the card is open;
pausing and resuming keeps the position rather than jumping back to `startTime`.

Playback has to begin inside a real user gesture or browsers block it, so the
`<audio>` element is mounted from the first render and `play()` is called
synchronously from the **Open** tap — not from an effect afterwards.

`public/music/yt-309a0c59-007.mp3` is a byte-identical duplicate of `bgm.mp3`;
delete it to save 3.8 MB in the build.

---

## How it is put together

```
src/
  data/invitation.js        All content + palette + decor asset paths
  lib/date.js               Date formatting, Google Calendar link, month grid
  hooks/
    useParallax.js          Decor drift, rAF-throttled, off-screen aware
    useReveal.js            Fade-up on first scroll into view
    useAutoScroll.js        Slow walk to the bottom, abandoned on first touch
    useCountdown.js         One-second tick to the wedding
  components/
    EnvelopeCover.jsx       Wax seal, petal burst, fly-forward open sequence
    InvitationCard.jsx      The card shell + gallery availability check
    CoverflowGallery.jsx    3D photo slider
    Lightbox.jsx            Full-screen viewer (keys, swipe, counter)
    Countdown / MiniCalendar / Rsvp / MusicPlayer
    Decor / GoldLine / SectionTitle
    sections/
      Hero.jsx              Arch, Ganesha, palace, bougainvillea
      CeremonyInfo.jsx      Both families, invitation line, full names, date
      Gallery.jsx
      Celebration.jsx       Countdown, framed calendar, add-to-calendar, RSVP
      MapSection.jsx        Venue, embedded map, directions link
      Guestbook.jsx
      Footer.jsx            Thank-you over the closing palace
```

### Design notes

The card is one column — 480px on phones, 900px from `md` up — over a paper
texture that repeats down its full length.

- **Palette** — maroon `#640e1b`, antique gold `#ab7a45`, cream `#f7e3cd`
- **Type** — The Nautigal (couple), Alex Brush (ampersand), EB Garamond (full
  names), Libre Baskerville (body), Times New Roman (section headings), Roboto
  (fine print)
- **Layout** — every decoration is positioned and sized in **percentages of the
  card width**, so the composition scales as one drawing instead of drifting
  apart between breakpoints. This is why the flowers and palaces stay locked to
  the arch at every screen size.

### Animations

| Where | What |
| --- | --- |
| Envelope | Wax seal pulses, then cracks with an expanding ring and a burst of petals; corner flower sprays rush past the viewer; the card lifts off the top of the screen |
| Envelope | 12 bougainvillea blossoms drift down the background on a seeded pattern, so the drift is identical on every load |
| Open button | A light sweep travels across it every 3s |
| Sections | Background decor drifts at 3.5–10% of scroll, opposite directions per element, throttled to one rAF per frame and idle while off screen |
| Gallery | Cards fan out on a 1000px perspective — each step from centre shifts 60%, sinks 150px, yaws 45° and loses scale and opacity. Auto-advances only while on screen, pauses on hover, and a manual nudge suspends it for 6s |
| Content | Sections fade up 18px the first time they scroll into view |
| Page | Auto-scrolls to the bottom at 30 px/s after opening, surrendering to the guest on their first scroll, swipe or tap |

Everything above collapses under `prefers-reduced-motion: reduce`: parallax and
autoplay switch off, reveals start visible, and looping animations stop.

### Accessibility

Decorative images are `aria-hidden` with empty `alt`. The lightbox is a labelled
modal that traps scroll and takes Escape / arrow keys. Controls are real
`<button>`s with labels, the RSVP modal closes on Escape, and the wedding day in
the calendar carries `aria-current="date"`.

---

## Credit

The layout, palette and decorative artwork follow the *Mahal Gold* template on
[chungdoi.com](https://chungdoi.com), reimplemented here as a standalone React
app. The `public/images/theme/` artwork came from that template — swap those
files if you would rather not ship them.
# aksha-wedding-card
