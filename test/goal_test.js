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
    it('evalAbove - duration 1', function() {
      var g = new Goal('testAbove', 1, 100, 1);
      // Not above for duration of 1 - no target matches
      assert.equal(false, g.func([90, 99, 95, 80]));
      // No history - empty array
      assert.equal(false, g.func([]));
      // Above for duration of 1
      assert.equal(true, g.func([98, 99, 98, 99, 98, 99, 101]));
      // No history - null
      assert.equal(false, g.func(null));
      // Not above for duration of 1 - target above but not at end
      assert.equal(false, g.func([98, 110, 99, 98, 99, 98, 99]));
    });
    it('evalAbove - duration 2', function() {
      var g = new Goal('testAbove', 1, 100, 2);
      // Not above for duration of 2 - no target matches
      assert.equal(false, g.func([90, 99, 94, 90]));
      // No history - empty array
      assert.equal(false, g.func([]));
      // Above for duration of 2
      assert.equal(true, g.func([98, 99, 98, 99, 98, 99, 101, 102]));
      // Not above for duration of 2 - only 1
      assert.equal(false, g.func([98, 99, 98, 99, 98, 99, 101]));
      // No history - null
      assert.equal(false, g.func(null));
      // Not above for duration of 2 - target matches but not at end
      assert.equal(false, g.func([98, 101, 102, 99, 98, 99, 98, 99]));
    });
    it('evalAbove - duration 10', function() {
      var g = new Goal('testAbove', 1, 100, 10);
      // Not above for duration of 10 - no target matches out of 14
      assert.equal(false, g.func([90, 99, 95, 90, 85, 80, 75, 70, 65,
                                  60, 55, 60, 65, 70]));
      // Not above for duration of 10 - no target matches out of 10
      assert.equal(false, g.func([90, 99, 50, 60, 70, 60, 60, 70, 80,
                                  70, 80, 70, 60, 65]));
      // Not enough data points to match duration
      assert.equal(false, g.func([90, 99, 101, 200, 150, 145, 140]));
      // No history - empty array
      assert.equal(false, g.func([]));
      // Above for duration of 10 out of more than 10
      assert.equal(true, g.func([98, 99, 98, 99, 98, 99, 101, 102, 103, 104,
                                105, 106, 107, 108, 109, 110]));
      // Above for duration of 10 out of 10
      assert.equal(true, g.func([101, 102, 103, 104,
                                105, 106, 107, 108, 109, 110]));
      // Not above for duration of 10 - only 9
      assert.equal(false, g.func([98, 99, 98, 99, 98, 99, 101, 102, 103, 104,
                                105, 106, 107, 108, 109]));
      // No history - null
      assert.equal(false, g.func(null));
    });
    it('evalBelow - duration 1', function() {
      var g = new Goal('testBelow', 2, 100, 1);
      // Not below for duration of 1 - no target matches
      assert.equal(false, g.func([200, 300, 101, 100]));
      // No history - empty array
      assert.equal(false, g.func([]));
      // Below for duration of 1
      assert.equal(true, g.func([101, 100, 105, 103, 100, 101, 99]));
      // No history - null
      assert.equal(false, g.func(null));
      // Not below for duration of 1 - target below but not at end
      assert.equal(false, g.func([101, 99, 105, 110, 105, 103, 102]));
    });
    it('evalBelow - duration 2', function() {
      var g = new Goal('testBelow', 2, 100, 2);
      // Not below for duration of 2 - no target matches
      assert.equal(false, g.func([189, 199, 194, 190]));
      // No history - empty array
      assert.equal(false, g.func([]));
      // Below for duration of 2
      assert.equal(true, g.func([120, 121, 122, 121, 130, 131, 99, 95]));
      // Not below for duration of 2 - only 1
      assert.equal(false, g.func([115, 116, 117, 118, 110, 105, 80]));
      // No history - null
      assert.equal(false, g.func(null));
      // Not below for duration of 2 - target matches but not at end
      assert.equal(false, g.func([101, 99, 95, 102, 105, 106, 105, 103]));
    });
    it('evalBelow - duration 10', function() {
      var g = new Goal('testBelow', 2, 100, 10);
      // Not below for duration of 10 - no target matches out of 14
      assert.equal(false, g.func([128, 129, 130, 132, 128, 125, 129, 130, 130,
                                  125, 126, 125, 121, 119]));
      // Not below for duration of 10 - no target matches out of 10
      assert.equal(false, g.func([109, 108, 105, 100, 101, 100, 110, 132, 145,
                                  146, 142, 144, 145, 144]));
      // Not enough data points to match duration
      assert.equal(false, g.func([90, 99, 101, 200, 150, 145, 140]));
      // No history - empty array
      assert.equal(false, g.func([]));
      // Below for duration of 10 out of more than 10
      assert.equal(true, g.func([110, 108, 108, 105, 103, 100, 99, 97, 94, 93,
                                94, 92, 95, 96, 94, 94]));
      // Below for duration of 10 out of 10
      assert.equal(true, g.func([78, 79, 82, 87,
                                90, 85, 83, 82, 85, 87]));
      // Not below for duration of 10 - only 9
      assert.equal(false, g.func([150, 150, 150, 150, 149, 151, 99, 98, 99, 98,
                                97, 96, 97, 96, 95]));
      // No history - null
      assert.equal(false, g.func(null));
    });
  });
});
