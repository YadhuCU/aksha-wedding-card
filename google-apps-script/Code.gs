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

/** Set an address to also receive an email per submission. '' disables it. */
var NOTIFY_EMAIL = ''

/**
 * Must match `sheet.token` in src/data/invitation.js.
 *
 * This is not a secret — it ships in the site's JavaScript and anyone can
 * read it. It only stops drive-by bots that POST to random endpoints. Real
 * abuse protection would need a captcha or a server you control.
 */
var SHARED_TOKEN = 'CHANGE_ME'

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

    if (!name || !message) {
      return json({ ok: false, error: 'name and message are required' })
    }

    /* Serialise appends so two guests submitting at once cannot collide. */
    var lock = LockService.getScriptLock()
    lock.waitLock(20000)
    try {
      getSheet().appendRow([new Date(), kind, name, message])
    } finally {
      lock.releaseLock()
    }

    if (NOTIFY_EMAIL) {
      notify(kind, name, message)
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

function trimTo(value, max) {
  return String(value == null ? '' : value).trim().slice(0, max)
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = ss.getSheetByName(SHEET_NAME)

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME)
    sheet.appendRow(['Received', 'Type', 'Name', 'Message'])
    sheet.setFrozenRows(1)
    sheet.getRange('A1:D1').setFontWeight('bold')
    sheet.setColumnWidth(1, 160)
    sheet.setColumnWidth(4, 520)
  }

  return sheet
}

function notify(kind, name, message) {
  try {
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: 'New ' + kind + ' from ' + name,
      body: name + ' wrote:\n\n' + message + '\n\n— Laxmi & Yadu invitation',
    })
  } catch (err) {
    /* Never fail the guest's submission over a mail quota. */
    console.error('notify failed: ' + err)
  }
}
