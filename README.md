# Email Tracker

This application implements an email pixel tracking system.  There are two main APIs, the pixel provisioning API and the tracking API.  Both are implemented in a single app for simplicity.

The system is built for multi-tenant SaaS deployment, an account login id is required to begin provisioning tracking pixels.  For e.g., to create a new tracking pixel a user of an account ("User") with login id "foo" will POST to /foo/pixel and retrieve pixel markup with GET /foo/pixel/:rid.

* [Setup](#setup)
* [Running locally](#running-locally)
* [Running the tests](#running-the-tests)

## Setup

To run the server, you need to do the following:
1.  Install node.js 8.x and npm.
1.  Install dependencies:

    npm install

## Running locally

npm start

## Running the tests

npm test

## Example request flow

1. Create a recipient and associate with the pre-existing "pcio" account:

  `$ curl -v http://localhost:8080/pcio/pixel -H 'Content-Type: application/json' --data '{"email": "gopaczewski@gmail.com"}'`

1. Retrieve the markup template to be included in an email to the recipient:

  `$ curl -v http://localhost:8080/pcio/pixel/1`

  (This should be the same URL as returned in the Location header of the first request)

1. Simulate an email opening for the first time on a device:

  `$ curl -v 'http://localhost:8080/v?u=1&aid=pcio'`

1. Simulate an email open on a repeat device:

  `$ curl -v --cookie "rid=1" 'http://localhost:8080/v?u=1&aid=pcio'`
