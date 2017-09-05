/**
 * Email Tracker
 */

'use strict';

const express = require('express');
const app = express();

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var pixel = require('./pixel');
var tracking = require('./tracking');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());

/*
 * Pixel API
 */
app.get('/:account_id/pixel/:rid', pixel.view);
app.post('/:account_id/pixel', pixel.create);

/*
 * Tracking API
 */
app.get('/v', tracking.view);

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
