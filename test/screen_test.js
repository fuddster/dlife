// Test lib/goalList.js

var assert = require('assert');
var Screen = require('../lib/screen.js');
var BloodSugar = require('../lib/bs.js');
var Goal = require('../lib/goal.js');
var GoalList = require('../lib/goalList.js');
var d3 = require('d3');
var svg = '<svg class="bgGraph" width="1200" height="600"></svg>';

describe('Screen - screen.js', function() {
  this.timeout(10000);
  beforeEach(function() {
    this.jsdom = require('jsdom-global')();
    var body = document.getElementsByTagName('body')[0];
    body.innerHTML = svg;
    console.log('before doc = ' + document.getElementsByTagName('html')[0].outerHTML);
  });

  afterEach(function() {
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
      assert.equal(10, s.guideDotsPerHr);
      assert.equal(120, s.numOfGuideDots);
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
      var bs = new BloodSugar(100);
      var gl = new GoalList();
      var s = new Screen(bs, gl, 500, d3);
      var node = null;
      var count = 0;

      // one way
      var elements = ['lowLine', 'highLine', 'maxLowLine', 'maxHighLine'];
      var idx;
      for (idx = 0; idx < elements.length; ++idx) {
        var e = elements[idx];
        node = s.group.select(e);
        assert(node, 'element: ' + e + ' missing.');
        var h = document.getElementsByClassName(e)[0];
        assert(h, 'element: ' + e + ' missing');
      }

      // Another way
      d3.selectAll('.lowLine').each(function(d, i) {
        count += 1;
      });
      assert.equal(count, 120, 'Not 120 lowLine circles');

      count = 0;
      d3.selectAll('.highLine').each(function(d, i) {
        count += 1;
      });
      assert.equal(count, 120, 'Not 120 highLine circles');

      count = 0;
      d3.selectAll('.maxLowLine').each(function(d, i) {
        count += 1;
      });
      assert.equal(count, 120, 'Not 120 maxLowLine circles');

      count = 0;
      d3.selectAll('.maxHighLine').each(function(d, i) {
        count += 1;
      });
      assert.equal(count, 120, 'Not 120 maxHighLine circles');

      // assert.equal(d3.select('.startButton').attr('text'), 'Start');
      s.group.selectAll('.startButton').each(function(d, i) {
        console.log(d);
        console.log(i);
        // console.log(d.attr('text'));
      });
      node = s.group.select('.startButton');
      // console.log(s);
      s.group.each(function(d, i) {
        console.log('d = ' + d);
      });
      console.log(s.group);
      console.log(node);
      // console.log(node.innerHTML());
      // console.log(node.outerHTML());
      // console.log(node.groups);
      // console.log(node.attr('text'));
      // console.log(node.text);
      // assert.equal(node.text, 'Start');
      // node.click();

      // Need more tests here
    });
  });

  describe('BGL Text color', function() {
    it('test normal bg is green', function() {
      var bs = new BloodSugar(100);
      var gl = new GoalList();
      var s = new Screen(bs, gl, 500, d3);
      assert.equal(s.group.select('.bgText').attr('fill'), '#0f0');
    });
    it('test medium bg is yellow', function() {
      var bs = new BloodSugar(79);
      var gl = new GoalList();
      var s = new Screen(bs, gl, 500, d3);
      assert.equal(s.group.select('.bgText').attr('fill'), '#ff0');
    });
    it('test max bg is red', function() {
      var bs = new BloodSugar(40);
      var gl = new GoalList();
      var s = new Screen(bs, gl, 500, d3);
      assert.equal(s.group.select('.bgText').attr('fill'), '#f00');
    });
  });

  describe('Display Success', function() {
    it('Display success message', function() {
      var bs = new BloodSugar(100);
      var gl = new GoalList();
      var s = new Screen(bs, gl, 500, d3);
      assert.equal(s.svg.select('.success').empty(), true);
      s.displaySuccess();
      console.log('-- Display Success --');
      console.log(s.svg.select('.success'));
      console.log(s.svg.select('.success').text());
      assert.equal(s.svg.select('.success').text(), 'Good Job');
    });
  });

  describe('Check Goals - No goals', function() {
    it('Check goal - no goals', function() {
      var bs = new BloodSugar(100);
      var gl = new GoalList();
      var s = new Screen(bs, gl, 500, d3);
      var succ = s.svg.select('.success');

      assert.equal(succ.empty(), true);
      s.checkGoals(s);
      succ = s.svg.select('.success');
      assert.equal(succ.attr('fill'), '#ff0');
      assert.equal(succ.text(), 'You did it!  Good Job!', 'No success display');
    });
  });
  describe('Check Goals - Goals', function() {
    it('Check goal - success screen if complete', function() {
      var bs = new BloodSugar(100);
      var gl = new GoalList();
      var g = new Goal('testGoal', 0, 100, 1);
      var s = new Screen(bs, gl, 500, d3);
      var succ = s.svg.select('.success');

      gl.addGoal(g);
      assert.equal(succ.empty(), true);
      s.checkGoals(s);
      succ = s.svg.select('.success');
      assert.equal(succ.attr('fill'), '#ff0');
      assert.equal(succ.text(), 'You did it!  Good Job!', 'No success display');
    });
  });

  describe('Check Tock', function() {
    it('Check tock - normal BGL', function() {
      var bs = new BloodSugar(100);
      var gl = new GoalList();
      var s = new Screen(bs, gl, 500, d3);
      console.log('--Check Tock--');
      assert.equal(s.minuteCount, 1, 'minuteCount not defaulting correctly');
      assert.equal(s.interval, 5, 'Not defaulting to 5 minute intervals');
      assert.equal(s.data.length, 1, 'Data should be 1');
      assert.equal(s.histData.length, 1, 'histData should be 1');
      assert.equal(s.textData[0], 100, 'Wrong default textData value');
      assert.equal(s.svg.select('.bgText').attr('fill'), '#0f0');
      s.tock(s);
      assert.equal(s.minuteCount, 2, 'minuteCount not incrementing correctly');
      s.tock(s);
      assert.equal(s.minuteCount, 3, 'minuteCount not incrementing correctly');
      s.tock(s);
      assert.equal(s.minuteCount, 4, 'minuteCount not incrementing correctly');
      s.tock(s);
      assert.equal(s.minuteCount, 5, 'minuteCount not incrementing correctly');
      s.tock(s);
      assert.equal(s.minuteCount, 1, 'minuteCount not incrementing correctly');
      assert.equal(s.data.length, 2, 'Data count should be 2');
      assert.equal(s.histData.length, 2, 'histData count should be 2');
      assert.equal(s.textData[0], 100, 'Wrong default textData value');
    });
    it('Check tock - yellow BGL', function() {
      var bs = new BloodSugar(200);
      var gl = new GoalList();
      var s = new Screen(bs, gl, 500, d3);
      assert.equal(s.svg.select('.bgText').attr('fill'), '#ff0');
      s.tock(s);
      assert.equal(s.svg.select('.bgText').attr('fill'), '#ff0');
    });
    it('Check tock - normal BGL', function() {
      var bs = new BloodSugar(20);
      var gl = new GoalList();
      var s = new Screen(bs, gl, 500, d3);
      assert.equal(s.svg.select('.bgText').attr('fill'), '#f00');
      s.tock(s);
      s.tock(s);
      s.tock(s);
      s.tock(s);
      s.tock(s);
      assert.equal(s.svg.select('.bgText').attr('fill'), '#f00');
    });
  });
});
