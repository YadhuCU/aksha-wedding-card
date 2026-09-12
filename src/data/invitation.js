/**
 * All wedding content lives here. Nothing else needs editing to change copy.
 */

export const invitation = {
  // ---------------------------------------------------------------- couple
  // brideFirst: true -> the bride's name/family is shown first.
  brideFirst: true,

  bride: {
    shortName: 'Laxmi',
    fullName: 'Laxmi R Das',
    parentTitle: 'Mr. & Mrs.',
    father: 'CV Ramadas',
    mother: 'Radhika K',
    address: 'SaiMatha, Pinarayi, Kannur.',
  },

  groom: {
    shortName: 'Yadu',
    fullName: 'Yadu Chakravarthy',
    parentTitle: 'Mr. & Mrs.',
    father: 'Vinod Kumar KG',
    mother: 'Sindhu G',
    address: 'Gopalakrishnam, Kottayampoyil, Kannur.',
  },

  // ------------------------------------------------------------------ event
  // ISO date + 24h time, in the venue's local time (IST).
  date: '2026-10-25',
  time: '10:30',
  timeZone: 'Asia/Kolkata',

  venue: {
    name: 'Pinarayi Convention Centre',
    address:
      'Pinarayi Convention Centre, Pinarayi, Kannur',
    // Used for the "Open in Google Maps" link.
    mapsUrl: 'https://maps.app.goo.gl/Dd5fVhrTqhLsy2We8',
    // Used for the embedded map iframe (no API key needed).
    embedQuery: 'Pinarayi Convention Centre, Pinarayi, Kerala 670741',
  },

  // ------------------------------------------------------------------- copy
  copy: {
    envelopeGreeting: 'Cordially Invites',
    openButton: 'Open',
    ceremonyInfoTitle: 'Wedding Info',
    announcement: 'We warmly invite you and your family to the wedding of',
    receptionInfoTitle: 'Wedding Info', // hided
    receptionAt: 'The wedding will take place at:',
    countdownTitle: 'Countdown',
    addToCalendar: 'Add to Calendar',
    galleryTitle: 'Photo Gallery',
    guestbookTitle: 'Mark Your Presence',
    guestbookSubtitle: 'Your presence would be the greatest gift we could receive',
    footerCompliments: 'With best compliments',
    guestbookGuestsLabel: 'Total guests attending',
    // Signature in the closing panel, under the thank-you.
    footerSignature: 'Akshay',
    rsvpButton: 'Confirm',
    // Blank because this exact sentence is now the heading of the form just
    // above the footer. Put text back here to show a closing line again.
    thankYouNote: '',
  },

  // --------------------------------------------------------------- gallery
  // Add or remove entries freely; files live in public/images/gallery/.
  // A file that is missing is skipped instead of showing a broken image.
  gallery: [
    { src: './images/gallery/couple-1.jpg' },
    { src: './images/gallery/couple-2.jpg' },
    { src: './images/gallery/couple-3.jpg' },
    { src: './images/gallery/couple-4.jpg' },
  ],

  // ----------------------------------------------------------------- sheet
  // PASTE YOUR APPS SCRIPT URL HERE. Wishes are written straight to your
  // Google Sheet when a guest presses send, so nothing depends on them
  // finishing in another app. Deployment steps are in the README.
  // While endpoint is empty the guestbook stays hidden rather than showing a
  // button that goes nowhere.
  sheet: {
    endpoint: 'https://script.google.com/macros/s/AKfycbxpfMhKlunIQzhRIJB20uQESrVsyHF9wZO0PeKwBdB6kLpl9r1pwiqjKHjv0k_6qapIFg/exec', // e.g. 'https://script.google.com/macros/s/AKfy.../exec'
    token: 'ly26-uwwTPxv4UirRExCd', // must match SHARED_TOKEN in google-apps-script/Code.gs
  },

  // ------------------------------------------------------------------ rsvp
  // Off by request. Switch enabled to true and replies land in the same
  // sheet as the wishes, tagged 'rsvp'.
  rsvp: {
    enabled: false,
    maxGuests: 10,
  },

  // ------------------------------------------------------------- guestbook
  // Wishes go to your Google Sheet. They are never shown on the page —
  // only you read them.
  guestbook: {
    enabled: true,
    maxGuests: 10, // dropdown runs from 1 to this number
  },

  // ----------------------------------------------------------------- scroll
  // After the envelope opens, the card walks itself down at a reading pace.
  // Stops for good the moment the guest scrolls, swipes or taps.
  autoScroll: {
    enabled: true,
    pixelsPerSecond: 30, // lower = slower
    startDelayMs: 1400, // settle on the hero before moving
  },

  // ----------------------------------------------------------------- music
  // Drop an .mp3 in public/music/ and point `src` at it.
  // startTime/endTime pick the stretch that loops, in seconds, so the song
  // opens on its chorus instead of its intro. Set endTime to null to loop the
  // whole file. Playback begins on the envelope's Open tap.
  music: {
    src: './music/bgm.mp3',
    volume: 0.5,
    startTime: 66, // 1:06
    endTime: 212, // 3:32
  },
}

export const theme = {
  primary: '#640e1b',
  secondary: '#ab7a45',
  background: '#f7e3cd',
  softLine: 'rgba(171, 122, 69, 0.35)',
}

const T = './images/theme'

export const decor = {
  paper: `${T}/paper.webp`,
  archFrame: `${T}/arch-frame.webp`,
  bells: `${T}/bells.webp`,
  ganesha: `${T}/ganesha.webp`,
  flower1: `${T}/flower1.webp`,
  flower2: `${T}/flower2.webp`,
  flower3: `${T}/flower3-decoration.webp`,
  castle: `${T}/castle.webp`,
  castle2: `${T}/castle2.webp`,
  sandstone: `${T}/sandstone.webp`,
  sandstoneFlower: `${T}/sandstone-flower.webp`,
  fence: `${T}/fence.webp`,
  pattern: `${T}/pattern.webp`,
  goldLine: `${T}/gold-line.webp`,
  calendarFrame: `${T}/calendar-frame.webp`,
}
