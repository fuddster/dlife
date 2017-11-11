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
        this.func = this.evalEquals;
      } else if (type === 1) {
        this.func = this.evalAbove;
      } else if (type === 2) {
        this.func = this.evalBelow;
      } else if (type === 3) {
        this.func = this.evalBolus;
      } else if (type === 4) {
        this.func = this.evalCarb;
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
      carb: 4,
    };

    Goal.prototype.evalEquals = function evalEquals(hist) {
      if (hist == null) {
        return false;
      }

      var len = hist.length;

      if (this.duration > len) {
        return false;
      }

      var ret = true;

      // Only compare the last "duration" values in the array
      for (var i = len; i > (len - this.duration); i--) {
        if (hist[(i-1)] != this.target) {
          ret = false;
        }
      }
      return ret;
    };

    Goal.prototype.evalAbove = function evalAbove(hist) {
      if (hist == null) {
        return false;
      }

      var len = hist.length;

      if (this.duration > len) {
        return false;
      }

      var ret = true;

      for (var i = len; i > (len - this.duration); i--) {
        if (hist[(i-1)] <= this.target) {
          ret = false;
        }
      }
      return ret;
    };

    Goal.prototype.evalBelow = function evalBelow(hist) {
      if (hist == null) {
        return false;
      }

      var len = hist.length;

      if (this.duration > len) {
        return false;
      }

      var ret = true;

      for (var i = len; i > (len - this.duration); i--) {
        if (hist[(i-1)] >= this.target) {
          ret = false;
        }
      }
      return ret;
    };

    Goal.prototype.evalBolus = function evalBolus(hist) {
      if (hist == null) {
        return false;
      }

      var len = hist.length;

      if (this.duration > len) {
        return false;
      }

      var ret = true;

      // NOT IMPLEMENTED
      console.error('evalBolus NOT IMPLEMENTED');
      ret = false;

      return ret;
    };

    Goal.prototype.evalCarb = function evalCarb(hist) {
      if (hist == null) {
        return false;
      }

      var len = hist.length;

      if (this.duration > len) {
        return false;
      }

      var ret = true;

      // NOT IMPLEMENTED
      console.error('evalCarb NOT IMPLEMENTED');
      ret = false;

      return ret;
    };

    Goal.prototype.markComplete = function markComplete() {
      this.complete = true;
    };

    return Goal;
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Goal;
  } else {
    window.Goal = Goal;
  }
})();
