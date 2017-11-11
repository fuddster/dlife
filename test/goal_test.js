// Test lib/goal.js

var assert = require('assert');
var Goal = require('../lib/goal.js');

describe('Goal - goal.js', function() {
  describe('Test Constructor', function() {
    it('Default Values', function() {
      var g = new Goal('testGoal', 0, 100, 1);
      assert.equal('testGoal', g.name);
      assert.equal(0, g.type);
      assert.equal(100, g.target);
      assert.equal(1, g.duration);
      assert.equal(false, g.complete);
      assert.equal(g.evalEquals, g.func);
      g = new Goal('testAbove', 1, 100, 1);
      assert.equal(g.evalAbove, g.func);
      g = new Goal('testBelow', 2, 100, 1);
      assert.equal(g.evalBelow, g.func);
      g = new Goal('testBolus', 3, 100, 1);
      assert.equal(g.evalBolus, g.func);
      g = new Goal('testCarbs', 4, 100, 1);
      assert.equal(g.evalCarb, g.func);
    });
    it('Mark Complete', function() {
      var g = new Goal('testGoal', 0, 100, 1);
      assert.equal(false, g.complete);
      g.markComplete();
      assert.equal(true, g.complete);
    });
    it('evalEquals - duration 1', function() {
      var g = new Goal('testEquals', 0, 100, 1);
      // Not equal for duration of 1 - no target matches
      assert.equal(false, g.func([90, 99, 101, 200]));
      // No history - empty array
      assert.equal(false, g.func([]));
      // Equal for duration of 1
      assert.equal(true, g.func([98, 99, 98, 99, 98, 99, 100]));
      // No history - null
      assert.equal(false, g.func(null));
      // Not equal for duration of 1 - target matches but not at end
      assert.equal(false, g.func([98, 100, 99, 98, 99, 98, 99]));
    });
    it('evalEquals - duration 2', function() {
      var g = new Goal('testEquals', 0, 100, 2);
      // Not equal for duration of 2 - no target matches
      assert.equal(false, g.func([90, 99, 101, 200]));
      // No history - empty array
      assert.equal(false, g.func([]));
      // Equal for duration of 2
      assert.equal(true, g.func([98, 99, 98, 99, 98, 99, 100, 100]));
      // Not equal for duration of 2 - only 1
      assert.equal(false, g.func([98, 99, 98, 99, 98, 99, 100]));
      // No history - null
      assert.equal(false, g.func(null));
      // Not equal for duration of 2 - target matches but not at end
      assert.equal(false, g.func([98, 100, 100, 99, 98, 99, 98, 99]));
    });
    it('evalEquals - duration 10', function() {
      var g = new Goal('testEquals', 0, 100, 10);
      // Not equal for duration of 10 - no target matches out of 14
      assert.equal(false, g.func([90, 99, 101, 200, 150, 145, 140, 135, 130,
                                  125, 120, 115, 110, 105]));
      // Not equal for duration of 10 - no target matches out of 10
      assert.equal(false, g.func([90, 99, 101, 200, 150, 145, 140, 135, 130,
                                  125, 120, 115, 110, 105]));
      // Not enough data points to match duration
      assert.equal(false, g.func([90, 99, 101, 200, 150, 145, 140]));
      // No history - empty array
      assert.equal(false, g.func([]));
      // Equal for duration of 10 out of more than 10
      assert.equal(true, g.func([98, 99, 98, 99, 98, 99, 100, 100, 100, 100,
                                100, 100, 100, 100, 100, 100]));
      // Equal for duration of 10 out of 10
      assert.equal(true, g.func([100, 100, 100, 100,
                                100, 100, 100, 100, 100, 100]));
      // Not equal for duration of 10 - only 9
      assert.equal(false, g.func([98, 99, 98, 99, 98, 99, 100, 100, 100, 100,
                                100, 100, 100, 100, 100]));
      // No history - null
      assert.equal(false, g.func(null));
    });
  });
});
