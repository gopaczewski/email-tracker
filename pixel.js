/*
 * Pixel API
 */

var model = require('./model');

exports.view = function(req, res) {
  var rid = req.params.rid;
  var accountId = req.params.account_id;
  if (! rid || ! accountId) {
    res.status(404).end();
    return;
  }
  var trackingHost = 't.pcio.com'; // todo : configurable
  var url = 'https://' + trackingHost + '/v?u=' + rid + '&aid=' + accountId + '&cb=[CACHE_BUSTER]';
  res.status(200)
      .append('Content-Type', 'text/html')
      .send('<img href="' + url + '" width="0" height="0" />')
      .end();
};

exports.create = function(req, res) {
  var userEmail = req.body.email;
  if (! userEmail) {
    res.status(400).json({error : 'Missing required email attribute from body'});
    return;
  }

  model.findAccount(req.params.account_id, requestedAccount => {
    if (! requestedAccount) {
      res.status(404).end();
      return;
    }
    model.createRecipient(requestedAccount, userEmail, rid => {
      res.status(201).append('Location', '/' + requestedAccount.id + '/pixel/' + rid).end();
    });
  });
};
