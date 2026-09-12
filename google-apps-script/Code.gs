/**
 * Guestbook + RSVP collector for the Laxmi & Yadu invitation.
 *
 * Deployed as a Google Apps Script Web App bound to a spreadsheet. Each
 * submission from the site is appended as a row, so wishes are captured the
 * moment a guest presses send — nothing depends on the guest completing a
 * second step in another app.
 *
 * Setup is in the project README, under "Guestbook".
 */

/* ----------------------------------------------------------------- config */

/** Tab the rows are written to. Created automatically if missing. */
var SHEET_NAME = 'Wishes'

/** Columns written, by name. Missing ones are added to an existing sheet. */
var HEADERS = ['Received', 'Type', 'Name', 'Guests', 'Message']

/** Set an address to also receive an email per submission. '' disables it. */
var NOTIFY_EMAIL = ''

/**
 * Must match `sheet.token` in src/data/invitation.js.
 *
 * This is not a secret — it ships in the site's JavaScript and anyone can
 * read it. It only stops drive-by bots that POST to random endpoints. Real
 * abuse protection would need a captcha or a server you control.
 */
var SHARED_TOKEN = 'ly26-uwwTPxv4UirRExCd'

var MAX_NAME = 80
var MAX_MESSAGE = 1000

/* ------------------------------------------------------------------ routes */

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json({ ok: false, error: 'empty request' })
    }

    var body = JSON.parse(e.postData.contents)

    if (SHARED_TOKEN && body.token !== SHARED_TOKEN) {
      return json({ ok: false, error: 'forbidden' })
    }

    var name = trimTo(body.name, MAX_NAME)
    var message = trimTo(body.message, MAX_MESSAGE)
    var kind = trimTo(body.kind, 20) || 'wish'
    var guests = toGuestCount(body.guests)

    if (!name || !message) {
      return json({ ok: false, error: 'name and message are required' })
    }

    /* Serialise appends so two guests submitting at once cannot collide. */
    var lock = LockService.getScriptLock()
    lock.waitLock(20000)
    try {
      appendSubmission({
        Received: new Date(),
        Type: kind,
        Name: name,
        Guests: guests,
        Message: message,
      })
    } finally {
      lock.releaseLock()
    }

    if (NOTIFY_EMAIL) {
      notify(kind, name, message, guests)
    }

    return json({ ok: true })
  } catch (err) {
    return json({ ok: false, error: String(err) })
  }
}

/** Lets you confirm the deployment is live by opening the URL in a browser. */
function doGet() {
  return json({ ok: true, service: 'laxmi-yadu-guestbook' })
}

/* ----------------------------------------------------------------- helpers */

/** Every route answers with JSON through here. */
function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  )
}

function trimTo(value, max) {
  return String(value == null ? '' : value).trim().slice(0, max)
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = ss.getSheetByName(SHEET_NAME)

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME)
    sheet.appendRow(HEADERS)
    sheet.setFrozenRows(1)
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold')
    sheet.setColumnWidth(1, 160)
    sheet.setColumnWidth(HEADERS.length, 520)
    return sheet
  }

  addMissingColumns(sheet)
  return sheet
}

/**
 * A sheet created before a column existed keeps working: anything in HEADERS
 * that is not already a header is appended on the right, leaving older rows
 * blank in that column rather than shifting their data.
 */
function addMissingColumns(sheet) {
  var header = readHeader(sheet)

  for (var i = 0; i < HEADERS.length; i++) {
    if (header.indexOf(HEADERS[i]) !== -1) continue

    var column = sheet.getLastColumn() + 1
    sheet.getRange(1, column).setValue(HEADERS[i]).setFontWeight('bold')
    header.push(HEADERS[i])
  }
}

function readHeader(sheet) {
  var width = Math.max(1, sheet.getLastColumn())
  return sheet.getRange(1, 1, 1, width).getValues()[0]
}

/** Places each value under its own header, whatever order the columns are in. */
function appendSubmission(values) {
  var sheet = getSheet()
  var header = readHeader(sheet)

  var row = header.map(function (name) {
    return values[name] === undefined ? '' : values[name]
  })

  sheet.appendRow(row)
}

/** 1-10, as a number so the column can be summed. Anything else becomes ''. */
function toGuestCount(value) {
  var n = parseInt(value, 10)
  if (isNaN(n) || n < 1) return ''
  return Math.min(n, 10)
}

function notify(kind, name, message, guests) {
  try {
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: 'New ' + kind + ' from ' + name,
      body:
        name +
        (guests ? ' (' + guests + (guests === 1 ? ' person' : ' people') + ')' : '') +
        ' wrote:\n\n' +
        message +
        '\n\n— Laxmi & Yadu invitation',
    })
  } catch (err) {
    /* Never fail the guest's submission over a mail quota. */
    console.error('notify failed: ' + err)
  }
}
