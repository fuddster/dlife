// Test lib/goal.js

var assert = require('assert');
var Goal = require('../lib/goal.js');

describe('goal.js', function() {
  describe('Goal', function() {
    describe('Test Constructor', function() {
      it('Default Values', function() {
        var g = new Goal('testGoal', 0, 100, 1);
        assert.equal('testGoal', g.name);
        assert.equal(0, g.type);
        assert.equal(100, g.target);
        assert.equal(1, g.duration);
      });
    });
  });
});
