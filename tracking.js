/*
 * Tracking API
 */

var model = require('./model');

var ONE_YEAR = 365 * 24 * 3600 * 1000;
var trackingDomain = '.pcio.com'; // todo : configurable

var pixelBytes = new Buffer(35);
pixelBytes.write("R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=", "base64");

/*
 * Record a tracking pixel event.
 */
exports.view = function(req, res) {
  var rid = req.query.u;
  var aid = req.query.aid;

  if (! rid) {
    res.send(pixelBytes, { 'Content-Type': 'image/gif' }, 200);
    return;
  }

  model.findRecipient(rid, recipient => {
    if (recipient) {
      var cookies = req.cookies;
      console.info("Cookies received: ", cookies);

      model.findAccount(recipient.createdByAccountId, account => {
        var knownDevice = null;
        if (req.cookies && req.cookies.rid) {
          knownDevice = req.get('user-agent');
        }
        sendEmail(account.alertEmail, recipient.email, new Date(), req.ip, knownDevice);
      });

      res.cookie('rid', rid, { domain: trackingDomain, path: '/v', maxAge: ONE_YEAR, secure: true });
    }

    // Always send a 200 with the 1x1 pixel
    res.send(pixelBytes, { 'Content-Type': 'image/gif' }, 200);
  });
}

function sendEmail(userEmail, recipientEmail, viewTimestamp, ipAddress, knownDevice) {
  console.info("Sending email...")
  console.info("To: " + userEmail);
  console.info(recipientEmail + " viewed email at " + viewTimestamp + " ipAddress=" + ipAddress);
  if (knownDevice) {
    console.info("Repeat view on device: " + knownDevice);
  }
}
