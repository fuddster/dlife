/* @flow */
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  //var swal = require('sweetalert2');
  var d3 = require('d3');
  var bs;
  var screen;
}

(function() {
  var Screen = (function() {
    var Screen = function(bs, gl, delay, dthree) {
      this.d3 = typeof dthree !== 'undefined' ? dthree : d3;
      delay = typeof delay !== 'undefined' ? delay : 500;
      this.minuteCount = 1;
      this.bgCount = 0;
      this.delay = delay;
      // this.delay = 100; // speed things up for testing
      // this.delay = 500;
      // this.delay = 5000;
      this.paused = 1; // Start paused
      this.minTimer = null; // Interval to pass time
      this.goalTimer = null; // Interval to check for success
      this.dotsPerHr = (60 / 5); // Every 5 minutes
      this.hrs = 12;
      this.n = 0; // Number of items on y axis - For 12 hrs
      this.guideDotsPerHr = 10;
      this.numOfGuideDots = 24; // Default to 24
      this.lowLevel = 80;
      this.highLevel = 180;
      this.maxHigh = 250;
      this.maxLow = 40;
      this.interval = 5; // 5 minutes per interval
      this.data = [bs.bloodSugar];
      this.histData = [bs.bloodSugar];
      this.textData = [bs.bloodSugar];
      this.svg = null;
      this.margin = null;
      this.width = null;
      this.height = null;
      this.xScale = null;
      this.yScale = null;
      this.lowLine = null;
      this.highLine = null;
      this.maxLowLine = null;
      this.maxHighLine = null;
      this.group = null;
      this.bolusButtonOn = false;
      this.carbButtonOn = true;
      this.eatButtonOn = false;
      this.delayOn = false;
      this.ISFOn = false;
      this.ICROn = false;
      this.bs = bs;
      this.gl = gl;

      console.log('Starting... D3 Version ' + this.d3.version);
      console.log('BS Starting...');
      console.log('Starting data = ' + this.data);
      console.log('Initial bs = ' + this.bs.bloodSugar);

      this.n = this.dotsPerHr * this.hrs; // Number of items on y axis - For 12 hrs
      this.numOfGuideDots = this.hrs * this.guideDotsPerHr; // Every 1/2 hr

      var ll = this.lowLevel;
      var hl = this.highLevel;
      var ml = this.maxLow;
      var mh = this.maxHigh;

      this.lowLine = this.d3.range(this.numOfGuideDots).map(function(d) {
        return ll;
      });
      this.highLine = this.d3.range(this.numOfGuideDots).map(function(d) {
        return hl;
      });
      this.maxLowLine = this.d3.range(this.numOfGuideDots).map(function(d) {
        return ml;
      });
      this.maxHighLine = this.d3.range(this.numOfGuideDots).map(function(d) {
        return mh;
      });

      this.svg = this.d3.select('.bgGraph');
      this.margin = {top: 120, right: 18, bottom: 20, left: 40};
      this.width = +this.svg.attr('width') - this.margin.left - this.margin.right;
      this.height = +this.svg.attr('height') - this.margin.top - this.margin.bottom;

      this.xScale = this.d3.scaleLinear()
        .domain([0, this.hrs])
        .range([0, this.width]);
      this.yScale = this.d3.scaleLinear()
        .domain([0, 260])
        .range([this.height, 0]);

      this.draw();
    };

    Screen.prototype.setDelay = function setDelay(delay) {
      if (delay > 0) {
        this.delay = delay;
      }
    };

    Screen.prototype.displayDelay = function displayDelay() {
      this.group.select('.delay')
        .attr('visibility', 'visable');
      this.delayOn = true;
    };

    Screen.prototype.draw = function draw() {
      this.group = this.svg.append('g').attr('transform', 'translate(' +
                    this.margin.left + ',' + this.margin.top + ')');

      var lineGroup = this.group.append('g');
      var xs = this.xScale;
      var ys = this.yScale;
      var gdph = this.guideDotsPerHr;
      var dph = this.dotsPerHr;
      var ll = this.lowLevel;
      var hl = this.highLevel;
      var ml = this.maxLow;
      var mh = this.maxHigh;
      var p = this.paused;
      var g = this.group;
      var startT = this.startTimers;
      var stopT = this.stopTimers;
      var scrn = this;

      lineGroup.selectAll('lowDot')
        .data(this.lowLine)
        .enter().append('circle')
        .attr('class', 'lowLine')
        .attr('r', 1)
        .attr('cx', function(d, i) {
          return xs(i / gdph);
        })
        .attr('cy', function(d, i) {
          return ys(d);
        });

      lineGroup.selectAll('highDot')
        .data(this.highLine)
        .enter().append('circle')
        .attr('class', 'highLine')
        .attr('r', 1)
        .attr('cx', function(d, i) {
          return xs(i / gdph);
        })
        .attr('cy', function(d, i) {
          return ys(d);
        });

      lineGroup.selectAll('maxLowDot')
        .data(this.maxLowLine)
        .enter().append('circle')
        .attr('class', 'maxLowLine')
        .attr('r', 1)
        .attr('cx', function(d, i) {
          return xs(i / gdph);
        })
        .attr('cy', function(d, i) {
          return ys(d);
        });

      lineGroup.selectAll('maxHighDot')
        .data(this.maxHighLine)
        .enter().append('circle')
        .attr('class', 'maxHighLine')
        .attr('r', 1)
        .attr('cx', function(d, i) {
          return xs(i / gdph);
        })
        .attr('cy', function(d, i) {
          return ys(d);
        });

      this.group.append('g')
        .attr('class', 'axis xAxis')
        .attr('transform', 'translate(0,' + this.yScale(0) + ')')
        .call(this.d3.axisBottom(this.xScale).ticks(25));

      this.group.append('g')
        .attr('class', 'axis yAxis')
        .call(this.d3.axisLeft(this.yScale).ticks(6));

      this.group.selectAll('.bgDot')
        .data(this.data)
        .enter().append('circle')
        .attr('class', 'bgDot')
        .attr('r', 4)
        .attr('cx', function(d, i) {
          return xs(i / dph);
        })
        .attr('cy', function(d, i) {
          return ys(d);
        });

      // Display BGL on screen
      this.group.selectAll('.bgText')
        .data(this.textData)
        .enter()
        .append('text')
        .attr('class', 'bgText')
        .text(function(d) {
          return d.toString();
        })
        .attr('fill', function(d) {
          if ((d < hl) && (d > ll)) {
            return '#0f0';
          }
          if ((d >= mh) || (d <= ml)) {
            return '#f00';
          }
          return '#ff0';
        } )
        .attr('x', this.width - 300)
        .attr('y', -10);

      // Display start button
      this.group.append('text')
        .attr('class', 'startButton')
        .text('Start')
        .attr('fill', '#0f0')
        .attr('x', 0)
        .attr('y', -30)
        .on('click', function(d) {
          console.log('paused = ' + p);
          if (p) {
            console.log('Starting.');
            g.selectAll('.startButton')
              .attr('fill', '#f00')
              .text('Pause');
            g.selectAll('.bgGraph')
              .attr('fill', '#fff');
            startT(scrn);
            p = 0;
          } else {
            console.log('Pausing.');
            g.selectAll('.startButton')
              .attr('fill', '#0f0')
              .text('Resume');
            g.selectAll('.bgGraph')
              .attr('fill', '#aa0');
            stopT(scrn);
            p = 1;
          }
        } );

      // Display Bolus button
      this.group.append('text')
        .attr('class', 'bolusButton')
        .text('Bolus')
        .attr('fill', '#00f')
        .attr('x', 160)
        .attr('y', -30)
        .attr('visibility', this.bolusButtonOn ? 'visable' : 'hidden')
        .on('click', function(d) {
          console.log('bolus click: this = ' + this.constructor.name);
          console.log('bs?: = ' + bs.constructor.name);
          var bolus = prompt('Bolus in units', 1);
          screen.setBolus(bolus);
        } );

      // Display Eat button
      this.group.append('text')
        .attr('class', 'eatButton')
        .text('Eat Carbs')
        .attr('fill', '#08f')
        .attr('x', 300)
        .attr('y', -30)
        .attr('visibility', this.bolusButtonOn ? 'visable' : 'hidden')
        .on('click', function(d) {
          console.log('carb click: this = ' + this.constructor.name);
          var c = prompt('Carbs eaten', 10);
          screen.setCarbs(c);
        } );

      console.log('ISF = 1:' + this.bs.insulinSensitivityFactor);

      // Display Delay
      this.group.append('text')
        .attr('class', 'delay')
        .text('Del:' + this.delay)
        .attr('fill', '#f0f')
        .attr('x', 1080)
        .attr('y', 450)
        .attr('visibility', this.delayOn ? 'visable' : 'hidden');

      // Display Insulin Sensitivity Factor
      this.group.append('text')
        .attr('class', 'isf')
        .text('ISF - 1:' + this.bs.insulinSensitivityFactor)
        .attr('fill', '#f0f')
        .attr('x', 320)
        .attr('y', -80)
        .attr('visibility', this.ISFOn ? 'visable' : 'hidden');

      // Display Insulin:Carb Ratio
      this.group.append('text')
        .attr('class', 'icr')
        .text('I:C Ratio - 1:' + this.bs.insulinToCarbRatio)
        .attr('fill', '#f0f')
        .attr('x', 470)
        .attr('y', -80)
        .attr('visibility', this.ICROn ? 'visable' : 'hidden');
    };

    Screen.prototype.setCarbs = function setCarbs(carbs) {
      if (carbs !== null) {
        if ((carbs !== null) && !isNaN(parseFloat(carbs)) && isFinite(carbs)) {
          this.bs.addCarbs(carbs); // Add 1 unit of insulin with a delay of 1 hr
          var s = carbs + ' carb' + ((parseFloat(carbs) == 1.0) ? '' : 's') + ' eaten';
          // TODO: Find a better way to alert or display message w/o alert
          //swal.fire('Eat Carbohydrates', s, 'info');
          // alert(carbs + ' carb' + (carbs == 1) ? '' : 's' + ' eaten');
        } else {
          // TODO: Find a better way to alert or display message w/o alert
          //swal.fire('Eat Carbohydrates', 'That is not a number', 'error');
          // alert('That is not a number');
        }
      }
    };

    Screen.prototype.setBolus = function setBolus(bolus) {
      if (bolus !== null) {
        if ((bolus !== null) && !isNaN(parseFloat(bolus)) && isFinite(bolus)) {
          this.bs.addInsulin(bolus); // Add 1 unit of insulin with a delay of 2 hr
          var s = 'Bolusing ' + bolus + ' unit' + ((parseFloat(bolus) == 1.0) ? '' : 's') + ' of insulin';
          // TODO: Find a better way to alert or display message w/o alert
          //swal.fire('Bolus', s, 'info');
        } else {
          // TODO: Find a better way to alert or display message w/o alert
          //swal.fire('Bolus', 'That is not a number', 'error');
        }
      }
    };

    Screen.prototype.enableBolus = function enableBolus(delay) {
      delay = typeof delay !== 'undefined' ? delay : this.bs.insulinDelay;
      console.log('enableBolus() - this = ' + this.constructor.name);
      console.log('Turn on bolus button');
      this.bs.insulinDelay = delay;
      this.group.select('.bolusButton')
        .attr('visibility', 'visable');
      this.bolusButtonOn = true;
    };

    Screen.prototype.enableEating = function enableEating(ci) {
      ci = typeof ci !== 'undefined' ? ci : this.bs.carbImpact;
      console.log('enableEating() - this = ' + this.constructor.name);
      console.log('Turn on eat button');
      this.bs.carbImpact = ci;
      this.group.select('.eatButton')
        .attr('visibility', 'visable');
      this.eatButtonOn = true;
    };

    Screen.prototype.displayISF = function displayISF() {
      console.log('displayISF() - this = ' + this.constructor.name);
      console.log('Turn on ISF display');
      this.group.select('.isf')
        .attr('visibility', 'visable');
      this.ISFOn = true;
    };

    Screen.prototype.displayICR = function displayICR() {
      console.log('displayICR() - this = ' + this.constructor.name);
      console.log('Turn on I:C Ratio display');
      this.group.select('.icr')
        .attr('visibility', 'visable');
      this.ICROn = true;
    };

    Screen.prototype.tock = function tock(screen) {
      console.log('tock() - this = ' + this.constructor.name);
      // console.log(screen);
      this.bs.tick();

      console.log('Count = ' + screen.minuteCount);
      // console.log(' Data = ' + screen.data.toString());
      // console.log(' Hist = ' + screen.histData.toString());

      if (screen.minuteCount == screen.interval) {
        var b = Math.round(this.bs.bloodSugar);
        screen.data.push(b);
        screen.histData.push(b);
        screen.textData.push(b);
        screen.textData.shift();

        console.log('shift? bgCount = ' + screen.bgCount + ' n = ' + screen.n);
        if (screen.bgCount < (screen.n - 1)) {
          screen.bgCount += 1;
        } else {
          console.log('Shift!');
          screen.data.shift();
        }

        var bgDot = screen.group.selectAll('.bgDot')
          .data(screen.data)
          .attr('r', 3)
          .attr('cx', function(d, i) {
            return screen.xScale(i / screen.dotsPerHr);
          })
          .attr('cy', function(d, i) {
            return screen.yScale(d);
          });

        bgDot.enter()
          .append('circle')
          .attr('class', 'bgDot')
          .attr('r', 5)
          .attr('cx', function(d, i) {
            return screen.xScale(i / screen.dotsPerHr);
          })
          .attr('cy', function(d, i) {
            return screen.yScale(d);
          });

        bgDot.exit().remove();

        var bgText = screen.group.selectAll('.bgText')
          .data(screen.textData)
          .text(function(d) {
            return d.toString();
          })
          .attr('fill', function(d) {
            if ((d < screen.highLevel) && (d > screen.lowLevel)) {
              return '#0f0';
            }
            if ((d >= screen.maxHigh) || (d <= screen.maxLow)) {
              return '#f00';
            }
            return '#ff0';
          })
          .attr('x', screen.width - 300)
          .attr('y', -10);

        bgText.exit().remove();

        // STOP EXECUTION
        // clearInterval(this.minTimer);

        screen.minuteCount = 1;
      } else {
        screen.minuteCount += 1;
      }
    };

    Screen.prototype.stopTimers = function stopTimers(screen) {
      console.log('stopTimers() - this = ' + this.constructor.name);
      clearInterval(screen.minTimer);
      clearInterval(screen.goalTimer);
    };

    Screen.prototype.startTimers = function startTimers(screen) {
      var t = screen.tock;
      var cg = screen.checkGoals;
      console.log('startTimers() - this = ' + this.constructor.name);
      // console.log(screen);
      screen.minTimer = setInterval(function() {
          t(screen);
      }, screen.delay);
      screen.goalTimer = setInterval(function() {
         cg(screen);
      }, (screen.delay * screen.interval));
    };

    Screen.prototype.displaySuccess = function displaySuccess(message) {
      message = typeof message !== 'undefined' ? message : 'Good Job';
      console.log('displaySuccess() - this = ' + this.constructor.name);
      // Display success message
      this.svg.append('rect')
        .attr('x', 0.1 * this.width)
        .attr('y', 0.3 * this.height)
        .attr('width', '80%')
        .attr('height', '40%')
        .attr('fill', '#578ad6');
      this.svg.append('text')
        .attr('class', 'success')
        .text(message)
        .attr('fill', '#ff0')
        .attr('x', this.width / 2)
        .attr('y', this.height / 2)
        .attr('text-anchor', 'middle');
    };

    Screen.prototype.checkGoals = function checkGoals(screen) {
      console.log('checkGoals() - this = ' + this.constructor.name);
      var goalsMet = 0;

      console.log('Checking goals');
      console.log('Hist len = ' + screen.histData.length);
      // console.log('Hist = ' + screen.histData);

      // determine if goals are met
      goalsMet = screen.gl.goalsComplete(screen.histData);

      if (goalsMet) {
        screen.displaySuccess('You did it!  Good Job!');
        screen.stopTimers(screen);
      }
    };


    return Screen;
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Screen;
  } else {
    window.Screen = Screen;
  }
})();
