var redis = require('redis-mock'),
db = redis.createClient();

function Account(id, companyName, alertEmail) {
  this.id = id;
  this.companyName = companyName;
  this.alertEmail = alertEmail;
}

/*
 * The Recipient is the person being tracked.
 */
function Recipient(email, createdByAccountId) {
  this.email = email;
  this.createdByAccountId = createdByAccountId;
}

// TODO : move to app init
var accounts = [];
db.hmset('account:pcio', new Account('pcio', 'Precognitive, Inc.', 'hello@precognitive.io'), (err, res) => {
  console.info("Succesfully seeded accounts db.");
});

/*
 * Lookup an account by account id.
 * @param {string} aid The account id.
 */
exports.findAccount = function(aid, onResponse) {
  db.hgetall('account:' + aid, (err, res) => { onResponse(res) });
}

/*
 * Create a rid for the given email, associated with a specific account.  This
 * method is idempotent, i.e. multiple requests to create the same recipient will
 * simply return the same rid.
 *
 * @param {Account} account The account to which the recipient will be associated.
 * @param {string} email The email address of the recipient.
 * @param {function} onCreate a callback that accepts a single rid param.
 */
exports.createRecipient = function(account, email, onCreate) {
  db.hget('recipient', account.id + ':' + email, (err, rid) => {
    if (rid) {
      onCreate(rid);
    } else {
      // NOTE: This makes the rid a guid across all accounts
      db.incr('rid', function(err, newRid) {
        console.info("Created new rid: " + newRid + " for account " + account.id);
        // TODO : this is a little broken - re-work with promises
        // store (account.id, recipient.email) => rid
        db.hset('recipient', account.id + ':' + email, newRid);
        // store (rid) => User
        db.hmset('recipient:' + newRid, new Recipient(email, account.id), (err, res) => { onCreate(newRid) });
      });
    }
  });
}

/*
 * Lookup a recipient by rid.
 * @param {string} rid The recipient id.
 */
exports.findRecipient = function(rid, onResponse) {
  db.hgetall('recipient:' + rid, (err, res) => { onResponse(res) });
}
