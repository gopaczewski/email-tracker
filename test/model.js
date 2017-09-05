var assert = require('assert');
var model = require('../model');

describe('Account', function() {

  describe('#findAccount', function() {
    it('should return undefined when the value is not present', function(done) {
      model.findAccount('foo', account => {
        assert.equal(undefined, account);
        done();
      });
    });

    it('should return the example account for id pcio', function(done) {
      model.findAccount('pcio', a => {
        assert.equal('pcio', a.id);
        assert.equal('Precognitive, Inc.', a.companyName);
        done();
      });
    });
  });

});
