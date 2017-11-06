var assert = require('assert');
var bs = require('../lib/bs');

describe('bs.js', function() {
  describe('BloodSugar', function() {
    var bloodsugar = bs.BloodSugar();
    it('should have no insulin on board', function() {
      assert.equal(0, bloodsugar.insulin);
    });
  });
});

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});
