// Test lib/goalList.js

var assert = require('assert');
var GoalList = require('../lib/goalList.js');
var Goal = require('../lib/goal.js');

describe('GoalList - goalList.js', function() {
  describe('Test Constructor', function() {
    it('Default Values', function() {
      var gl = new GoalList();
      assert.equal(0, gl.goals.length);
    });
    it('addGoal', function() {
      var gl = new GoalList();
      var g = new Goal('testGoal', 0, 100, 1);
      gl.addGoal(g);
      assert.equal(1, gl.goals.length);
      assert.equal(g, gl.goals[0]);
      gl.addGoal(g);
      assert.equal(2, gl.goals.length);
    });
  });
});
