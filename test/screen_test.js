// Test lib/goalList.js

var assert = require('assert');
var Screen = require('../lib/screen.js');
var BloodSugar = require('../lib/bs.js');
var GoalList = require('../lib/goalList.js');
var d3 = require('d3');
var svg = '<svg class="bgGraph" width="1200" height="600"></svg>';

describe('Screen - screen.js', function() {
  this.timeout(5000);
  before(function() {
    this.jsdom = require('jsdom-global')();
    var body = document.getElementsByTagName('body')[0];
    body.innerHTML = svg;
    console.log('before doc = ' + document.getElementsByTagName('html')[0].outerHTML);
  });

  after(function() {
    this.jsdom();
  });

  describe('Test Constructor', function() {
    it('Default Values', function() {
      var bs = new BloodSugar(100);
      var gl = new GoalList();
      var s = new Screen(bs, gl, 500, d3);

      assert.equal(500, s.delay);
      assert.equal(1, s.paused);
      assert.equal(null, s.minTimer);
      assert.equal(null, s.goalTimer);
      assert.equal(12, s.dotsPerHr);
      assert.equal(12, s.hrs);
      assert.equal(2, s.guideDotsPerHr);
      assert.equal(24, s.numOfGuideDots);
      assert.equal(80, s.lowLevel);
      assert.equal(180, s.highLevel);
      assert.equal(250, s.maxHigh);
      assert.equal(40, s.maxLow);
      assert.equal(5, s.interval);
      assert.equal(bs, s.bs);
      console.log('5');
    });
  });

  describe('Set Delay', function() {
    it('sets demo speed', function() {
      var bs = new BloodSugar(100);
      var gl = new GoalList();
      var s = new Screen(bs, gl, 500, d3);

      assert.equal(500, s.delay);
      s.setDelay(-1000);
      assert.equal(500, s.delay);
      s.setDelay(0);
      assert.equal(500, s.delay);
      s.setDelay(1000);
      assert.equal(1000, s.delay);
      s.setDelay(1);
      assert.equal(1, s.delay);
    });
  });

  describe('Draw', function() {
    it('test that drawing is done', function() {
      var elements = ['lowLine', 'highLine', 'maxLowLine', 'maxHighLine'];
      var idx;
      for (idx = 0; idx < elements.length; ++idx) {
        var e = elements[idx];
        var h = document.getElementsByClassName(e)[0];
        assert(h, 'element: ' + e + ' missing');
      }
      var lowline = document.getElementsByClassName('lowLine')[0];
      assert(lowline);
    });
  });
});
