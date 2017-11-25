// Test lib/goalList.js

var assert = require('assert');
var Screen = require('../lib/screen.js');
var BloodSugar = require('../lib/bs.js');
var GoalList = require('../lib/goalList.js');
var d3 = require('d3');
var svg = '<svg class="bgGraph" width="1200" height="600"></svg>';

describe('Screen - screen.js', function() {
  this.timeout(10000);
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
    it('Sets demo speed', function() {
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

  describe('Display Delay', function() {
    it('Display demo speed', function() {
      var bs = new BloodSugar(100);
      var gl = new GoalList();
      var s = new Screen(bs, gl, 500, d3);
      assert.equal(false, s.delayOn);
      var h = document.getElementsByClassName('delay')[0];
      var v = h.getAttribute('visibility');
      assert.equal(v, 'hidden');
      assert.equal(s.group.select('.delay').attr('visibility'), 'hidden');
      s.displayDelay();
      assert.equal(true, s.delayOn);
      assert.equal(s.group.select('.delay').attr('visibility'), 'visable');
    });
  });

  describe('Enable Bolus', function() {
    it('Display bolus button', function() {
      var bs = new BloodSugar(100);
      var id = bs.insulinDelay;
      var gl = new GoalList();
      var s = new Screen(bs, gl, 500, d3);
      assert.equal(false, s.bolusButtonOn);
      var h = document.getElementsByClassName('bolusButton')[0];
      var v = h.getAttribute('visibility');
      assert.equal(v, 'hidden');
      assert.equal(s.group.select('.bolusButton').attr('visibility'), 'hidden');
      s.enableBolus();
      assert.equal(bs.insulinDelay, id);
      assert.equal(true, s.bolusButtonOn);
      assert.equal(s.group.select('.bolusButton').attr('visibility'), 'visable');
    });

    it('Display bolus button with delay', function() {
      var bs = new BloodSugar(100);
      var gl = new GoalList();
      var s = new Screen(bs, gl, 500, d3);
      assert.equal(false, s.bolusButtonOn);
      var h = document.getElementsByClassName('bolusButton')[0];
      var v = h.getAttribute('visibility');
      assert.equal(v, 'hidden');
      assert.equal(s.group.select('.bolusButton').attr('visibility'), 'hidden');
      s.enableBolus(999);
      assert.equal(bs.insulinDelay, 999);
      assert.equal(true, s.bolusButtonOn);
      assert.equal(s.group.select('.bolusButton').attr('visibility'), 'visable');
    });
  });

  describe('Enable Eating', function() {
    it('Display eat(carbs) button', function() {
      var bs = new BloodSugar(100);
      var ci = bs.carbImpact;
      var gl = new GoalList();
      var s = new Screen(bs, gl, 500, d3);
      assert.equal(false, s.eatButtonOn);
      var h = document.getElementsByClassName('eatButton')[0];
      var v = h.getAttribute('visibility');
      assert.equal(v, 'hidden');
      assert.equal(s.group.select('.eatButton').attr('visibility'), 'hidden');
      s.enableEating();
      assert.equal(bs.carbImpact, ci);
      assert.equal(true, s.eatButtonOn);
      assert.equal(s.group.select('.eatButton').attr('visibility'), 'visable');
    });

    it('Display bolus button with carb impact', function() {
      var bs = new BloodSugar(100);
      var gl = new GoalList();
      var s = new Screen(bs, gl, 500, d3);
      assert.equal(false, s.eatButtonOn);
      var h = document.getElementsByClassName('eatButton')[0];
      var v = h.getAttribute('visibility');
      assert.equal(v, 'hidden');
      assert.equal(s.group.select('.eatButton').attr('visibility'), 'hidden');
      s.enableEating(33);
      assert.equal(bs.carbImpact, 33);
      assert.equal(true, s.eatButtonOn);
      assert.equal(s.group.select('.eatButton').attr('visibility'), 'visable');
    });
  });

  describe('Display ISF', function() {
    it('Display insulin sensitivity factor', function() {
      var bs = new BloodSugar(100);
      var gl = new GoalList();
      var s = new Screen(bs, gl, 500, d3);
      assert.equal(false, s.ISFOn);
      var h = document.getElementsByClassName('isf')[0];
      var v = h.getAttribute('visibility');
      assert.equal(v, 'hidden');
      assert.equal(s.group.select('.isf').attr('visibility'), 'hidden');
      s.displayISF();
      assert.equal(true, s.ISFOn);
      assert.equal(s.group.select('.isf').attr('visibility'), 'visable');
    });
  });

  describe('Display ICR', function() {
    it('Display insulin:carb ratio', function() {
      var bs = new BloodSugar(100);
      var gl = new GoalList();
      var s = new Screen(bs, gl, 500, d3);
      assert.equal(false, s.ICROn);
      var h = document.getElementsByClassName('icr')[0];
      var v = h.getAttribute('visibility');
      assert.equal(v, 'hidden');
      assert.equal(s.group.select('.icr').attr('visibility'), 'hidden');
      s.displayICR();
      assert.equal(true, s.ICROn);
      assert.equal(s.group.select('.icr').attr('visibility'), 'visable');
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

      // Need more tests here
    });
  });

  describe('Enable Bolus', function() {
    it('Display bolus button', function() {
    });
  });
});
