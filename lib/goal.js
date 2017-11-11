/* @flow */
(function() {
  var Goal = (function() {
    var Goal = function(name, type, target, duration) {
      name = typeof name !== 'undefined' ? name : 'noName';
      type = typeof type !== 'undefined' ? type : 0;
      target = typeof target !== 'undefined' ? target : 100;
      duration = typeof duration !== 'undefined' ? duration : 1;

      this.name = name;
      this.type = type;
      this.target = target;
      this.duration = duration;
      this.complete = false;

      if (type === 0) {
        this.func = Goal.evalEquals;
      } else if (type === 1) {
        this.func = Goal.evalAbove;
      } else if (type === 2) {
        this.func = Goal.evalBelow;
      } else if (type === 3) {
        this.func = Goal.evalBolus;
      } else if (type === 4) {
        this.func = Goal.evalCarb;
      };
    };

    /*
      List of goal types - Combine for more complex types

      between - "above 100", "below 180"
      breakfast - "below 150", "carb 50"
    */
    Goal.prototype.typeList = {
      equals: 0,
      above: 1,
      below: 2,
      bolus: 3,
      carb: 4
    };

    Goal.prototype.evalEquals = function evalEquals(hist) {
      console.log('evalEquals() - this = ' + this.constructor.name);
      var len = hist.length;

      console.log('evalEquals:len = ' + len);
      console.log('evalEquals:' + hist);

      if (this.duration > len) {
        return false;
      }

      var ret = true;

      for (var i = len; i > (len - this.duration); i--) {
        console.log('evalEquals:hist[' + (i-1) + '](' + hist[(i-1)] +
                    ') equals ' + this.target + '?');
        if (hist[(i-1)] != this.target) {
          ret = false;
        }
      }
      return ret;
    };

    Goal.prototype.evalAbove = function evalAbove(hist) {
      console.log('evalAbove() - this = ' + this.constructor.name);
      var len = hist.length;

      console.log('evalAbove:len = ' + len);
      console.log('evalAbove:' + hist);

      if (this.duration > len) {
        return false;
      }

      var ret = true;

      for (var i = len; i > (len - this.duration); i--) {
        console.log('evalAbove:hist[' + (i-1) + '](' + hist[i-1] +
                    ') equals ' + this.target + '?');
        if (hist[(i-1)] <= this.target) {
          ret = false;
        }
      }
      return ret;
    };

    Goal.prototype.evalBelow = function evalBelow(hist) {
      console.log('evalBelow() - this = ' + this.constructor.name);
      var len = hist.length;

      console.log('evalBelow:len = ' + len);
      console.log('evalBelow:' + hist);

      if (this.duration > len) {
        return false;
      }

      var ret = true;

      for (var i = len; i > (len - this.duration); i--) {
        console.log('evalBelow:hist[' + (i-1) + '](' + hist[i-1] +
                    ') equals ' + this.target + '?');
        if (hist[(i-1)] >= this.target) {
          ret = false;
        }
      }
      return ret;
    };

    Goal.prototype.evalBolus = function evalBolus(hist) {
      console.log('evalBolus() - this = ' + this.constructor.name);
    };

    Goal.prototype.evalCarb = function evalCarb(hist) {
      console.log('evalCarbs() - this = ' + this.constructor.name);
    };

    Goal.prototype.markComplete = function markComplete() {
      console.log('markComplete() - this = ' + this.constructor.name);
      this.complete = true;
    };

    return Goal;
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Goal;
  } else {
    window.Goal = Goal;
  };
})();
