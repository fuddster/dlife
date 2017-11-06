const assert = require('assert');
var BloodSugar = require('../lib/bs.js');

describe('bs.js', function() {
  describe('BloodSugar', function() {
    console.log(BloodSugar);
    var bs = new BloodSugar(123);
    it('should have no insulin on board', function() {
      assert.equal(0, bs.insulin);
    });
    it('should have a blood sugar of 123', function() {
      assert.equal(123, bs.bloodSugar);
    });
  });
});

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1, 2, 3].indexOf(4));
    });
  });
});
