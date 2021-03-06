/* @flow */
(function() {
  var BloodSugar = (function() {
    var BloodSugar = function(initialValue) {
      this.hasDrift = false;
      this.hasExercise = false;
      this.hasCarbs = false;
      this.hasStress = false;
      this.hasHormones = false;
      this.hasDawnEffect = false;

      this.maxDrift = 0; // max drift per hr

      // Exercise Constants
      this.exercise = 0;
      this.exerciseImpactDefault = 20; // impact per hr for light exercise
      this.exerciseDurationDefault = 30; // Default duration to 30 minutes
      this.exerciseDurationOfImpact = 0; // hrs of exercise impact
      this.exerciseIntensity = [1, 2, 4]; // Light(1x),Medium(2x),Strenuous(4x)
      this.exerciseDelay = 10; // Delay before exercise impact start
      this.exerciseDelayCountDown = this.exerciseDefault;
      this.exerciseDurationCountDown = 0;

      this.stress = 0; // impact of stress on bs
      this.stressDurationOfImpact = 0; // hrs of stress impact
      this.hormones = 0; // impact of homones per hr
      this.dawnEffect = 0; // dawn effect per hr
      this.dawnEffectStart = 3; // hr of start of dawn effect (0-23)
      this.dawnEffectStop = 6; // hr of end of dawn effect (0-23)

      // Blood Sugar
      // console.log("Setting initial bloodSugar to " + initialValue);
      this.bloodSugar = initialValue;

      // Insulin Constants
      // @todo switch to array so multiple dosing can be tracked
      // How long before insulin starts impacting bs in minutes - Constant
      this.insulinDelay = 60;
      // 1:x - 1 unit of insulin brings down bs by x
      this.insulinSensitivityFactor = 30;
      this.insulinToCarbRatio = 10; // I:C Ratio set to 1:10
      this.insulinDurationHrs = 3; // How long the insulin lasts in hrs
      this.insulinDurationMins = this.insulinDurationHrs * 60;
      this.insulinSineSum = 0;
      this.sineInterval = 0;

      // Carb constants
      this.carbs = 0; // grams of carbs
      // impact on bs per carb (i.e. 1 carb = +3 BS points)
      this.carbImpact = this.insulinSensitivityFactor / this.insulinToCarbRatio;
      this.carbDelay = 5; // 5 minutes for quick sugar
      this.carbDurationMins = 15; // 15 minutes for quick sugar
      this.carbDelayCountDown = this.carbDelay;
      this.carbImpactCountDown = this.carbDurationMins;
      this.carbSineSum = 0;
      this.carbSineInterval = 0;

      // Insulin variables
      // Count down to insulin inpact
      this.insulinDelayCountDown = this.insulinDelay;
      this.insulinDoseCountDown = this.insulinDurationMins;
      this.insulin = 0;

        // Tick
      this.tickValue = 1; // in minutes

      this.eatTimer = null;
    };

    BloodSugar.prototype.view = function view() {
      console.log('view:bs = '+this.bloodSugar);
      console.log('InsulinDelayCountDown = '+this.insulinDelayCountDown);
    };

    BloodSugar.prototype.turnOnDrift = function turnOnDrift(md) {
      md = typeof md !== 'undefined' ? md : 0;
      this.hasDrift = true;
      this.maxDrift = md;
    };

    BloodSugar.prototype.turnOffDrift = function turnOffDrift() {
      this.hasDrift = false;
      this.maxDrift = 0;
    };

    BloodSugar.prototype.turnOnExercise = function turnOnExercise(exercise, exerciseDurationOfImpact) {
      this.hasExercise = true;
      this.exercise = exercise;
      this.exerciseDurationOfImpact = exerciseDurationOfImpact;
    };

    BloodSugar.prototype.turnOnExerciseIntensity = function turnOnExerciseIntensity(
          exercise, exerciseDurationOfImpact, exerciseIntensity) {
      this.hasExercise = true;
      this.exercise = exercise * this.exerciseIntensity[exerciseIntensity];
      this.exerciseDurationOfImpact = exerciseDurationOfImpact;
    };

    BloodSugar.prototype.turnOffExercise = function turnOffExercise() {
      this.hasExercise = false;
      this.exercise = 0;
      this.exerciseDurationOfImpact = 0;
    };

    BloodSugar.prototype.turnOnCarbs = function turnOnCarbs(carbs) {
      carbs = typeof carbs !== 'undefined' ? carbs : 0;
      if (carbs == 0) {
        console.warn('turnOnCarbs() called with no parameters.  carbs is set to 0');
      }
      this.hasCarbs = true;
      this.carbs = carbs;
    };

    BloodSugar.prototype.turnOnCarbsWithImpact =
    function turnOnCarbsWithImpact(carbs, carbImpact) {
      carbs = typeof carbs !== 'undefined' ? carbs : 0;
      carbImpact = typeof carbImpact !== 'undefined' ? carbImpact : 0;
      if (carbs == 0) {
        console.warn('turnOnCarbsWithImpact() called with no parameters.  carbs and carbImpact set to 0');
      } else if (carbImpact == 0) {
        console.warn('turnOnCarbsWithImpact() called with no carbImpact value.  It will be set to 0');
      }
      this.hasCarbs = true;
      this.carbs = carbs;
      this.carbImpact = carbImpact;
    };

    BloodSugar.prototype.turnOffCarbs = function turnOffCarbs() {
      this.hasCarbs = false;
      this.carbs = 0;
      // impact on bs per carb (i.e. 1 carb = +3 BS points)
      this.carbImpact = this.insulinSensitivityFactor / this.insulinToCarbRatio;
    };

    BloodSugar.prototype.turnOnStress =
    function turnOnStress(stress, stressDurationOfImpact) {
      this.hasStress = true;
      this.stress = stress;
      this.stressDurationOfImpact = stressDurationOfImpact;
    };

    BloodSugar.prototype.turnOffStress = function turnOffStress() {
      this.hasStress = false;
      this.stress = 0;
      this.stressDurationOfImpact = 0;
    };

    BloodSugar.prototype.turnOnHormones = function turnOnHormones(hormones) {
      this.hasHormones = true;
      this.hormones = hormones;
    };

    BloodSugar.prototype.turnOffHormones = function turnOffHormones() {
      this.hasHormones = false;
      this.hormones = 0;
    };

    BloodSugar.prototype.turnOnDawnEffect =
    function turnOnDawnEffect(dawnEffect) {
      this.hasDawnEffect = true;
      this.dawnEffect = dawnEffect;
    };

    BloodSugar.prototype.turnOnDawnEffectWithTime = function
    turnOnDawnEffectWithTime(dawnEffect, dawnEffectStart, dawnEffectStop) {
      this.hasDawnEffect = true;
      this.dawnEffect = dawnEffect;
      this.dawnEffectStart = dawnEffectStart;
      this.dawnEffectStop = dawnEffectStop;
    };

    BloodSugar.prototype.turnOffDawnEffect = function turnOffDawnEffect() {
      this.hasDawnEffect = false;
      this.dawnEffect = 0;
      this.dawnEffectStart = 3;
      this.dawnEffectStop = 6;
    };

    BloodSugar.prototype.calcInsulinPercentageSine =
    function calcInsulinPercentageSine() {
      //
      // Sine insulin calculation
      //    sine(0) to sine(180) area is 2 so divide by 2
      //    0-180 map to insulinDoseCountDown -> 0
      // insulin = (totalInsulin * (sine(insulinDoseCountDown) / 2))
      //            * insulinSensitivityFactor * -1
    };

    /** Calculate the Drift for a tick
     * @return {number} amount of drift; return zero if drift is turned off
     */
    BloodSugar.prototype.calcDrift = function calcDrift() {
      var d = 0;
      if (this.hasDrift) {
        d = Math.random() * (this.maxDrift / 60);
        if (Math.random() < 0.5) {
          d *= -1;
        }
      }
      return d;
    };

    BloodSugar.prototype.tick = function tick() {
      // Move time forward one "tick"
      console.log('Starting BS = ' + this.bloodSugar);

      // Insulin
      var i = 0;
      var p = 0;
      console.log('If:InsulinDelayCountDown = ' + this.insulinDelayCountDown);
      if ((this.insulinDelayCountDown > 0) && (this.insulinDoseCountDown > 0)) {
        this.insulinDelayCountDown = this.insulinDelayCountDown - 1;
      } else {
        if ((this.insulinDoseCountDown > 0) && (this.insulin > 0)) {
          // Calc #1 - Straight line
          // insulin effect = (insulin / insulinDurationMins)
          //                   * insulinSensitivityFactor * -1
          // i = (this.insulin*percentage) * this.insulinSensitivityFactor * -1;
          // p = 1 / this.insulinDurationMins;

          // Calc #2 - Sine curve
          // insulin effect = insulin * (Sin(insulinDoseCountDown)
          //                  / insulinSineSum) * insulinSensitivityFactor * -1
          p = Math.sin(this.insulinDoseCountDown *
                      this.sineInterval) / this.insulinSineSum;
          console.log('Percentage = ' + p);
          i = (this.insulin * p) * this.insulinSensitivityFactor * -1;
          console.log('insulin = ' + i);
          this.insulinDoseCountDown--;
          console.log('DoseCountDown = ' + this.insulinDoseCountDown);
          console.log('Dose = ' + this.insulin);
        }
      }

      // Carbs
      var c = 0;
      console.log('If:carbDelayCountDown = ' + this.carbDelayCountDown);
      if ((this.carbDelayCountDown > 0) && (this.carbImpactCountDown > 0)) {
        this.carbDelayCountDown = this.carbDelayCountDown - 1;
      } else {
        if ((this.carbImpactCountDown > 0) && (this.carbs > 0)) {
          // Calc #1 - Straight line
          // insulin effect = (insulin / insulinDurationMins)
          //       * insulinSensitivityFactor * -1
          // i = (this.insulin*percentage) * this.insulinSensitivityFactor * -1;
          // p = 1 / this.insulinDurationMins;

          // Calc #2 - Sine curve
          // insulin effect = insulin * (Sin(insulinDoseCountDown)
          //     / insulinSineSum) * insulinSensitivityFactor * -1
          p = Math.sin(this.carbImpactCountDown *
                      this.carbSineInterval) / this.carbSineSum;
          console.log('Percentage = ' + p);
          c = (this.carbs * p) * this.carbImpact;
          console.log('carbs = ' + c);
          this.carbImpactCountDown--;
          console.log('carbImpactCountDown = ' + this.carbImpactCountDown);
          console.log('Carbs = ' + this.carbs);
        }
      }

      // Drift
      var d = this.calcDrift();

      // Exercise
      var e = 0;
      if ((this.exerciseDelayCountDown > 0) &&
          (this.exerciseDurationCountDown > 0)) {
        this.exerciseDelayCountDown += -1;
      } else {
        if (this.exerciseDurationCountDown > 0) {
          console.log('Exercise = ' + this.exercise);
          console.log('Exercise duration = ' + this.exerciseDurationOfImpact);
          e = this.exercise / this.exerciseDurationOfImpact;
          e *= -1;
          console.log('Exercise Impact (e) = ' + e);
          this.exerciseDurationCountDown -= 1;
        }
      }

      this.bloodSugar += i;
      this.bloodSugar += d;
      this.bloodSugar += c;
      this.bloodSugar += e;

      // Fix Negative Number Bug
      if (this.bloodSugar < 0) {
        this.bloodSugar = 0;
      }

      console.log('New BS = '+this.bloodSugar);
    };

    BloodSugar.prototype.addInsulin = function addInsulin(units) {
      this.addInsulinWithDelay(units, this.insulinDelay);
    };

    BloodSugar.prototype.addInsulinWithDelay =
    function addInsulinWithDelay(units, delay) {
      this.insulin = units;
      this.insulinDelay = delay;
      this.insulinDelayCountDown = this.insulinDelay;
      this.insulinDoseCountDown = this.insulinDurationMins;

      // Calculate Sine Sum
      this.insulinSineSum = 0;
      this.sineInterval = Math.PI / this.insulinDurationMins;
      for (var i=0; i <= Math.PI; i += this.sineInterval) {
        this.insulinSineSum += Math.sin(i);
      }
      // console.log("insulinSineSum = "+this.insulinSineSum);
    };

    BloodSugar.prototype.addCarbs = function addCarbs(carbs, when, msg, delay) {
      when = typeof when !== 'undefined' ? when : 0;
      msg = typeof msg !== 'undefined' ? msg : null;
      delay = typeof delay !== 'undefined' ? delay : 50000;
      console.log('addCarbs: carbs = ' + carbs + '  when: ' + when +
        '  msg: ' + msg);
      console.log('this is:' + this.constructor.name);
      if (when > 0) {
          var del = when * delay;
          console.log('addCarbs: when: ' + when);
          console.log('addCarbs: delay: ' + delay);
          console.log('addCarbs: del = ' + del);
          console.log('this is:' + this.constructor.name);
          this.eatTimer = setTimeout(function(d) {
            this.bs_addCarbs(carbs, 0, msg);
          }, del);
          return;
      }
      if (msg != null) {
        alert(msg);
      }
      this.carbs = carbs;
      // Duration is 2 minutes for every 1 carb
      // (5 carbs = 10 min; 30 carbs = 1 hr; etc)
      this.carbDurationMins = 2 * this.carbs;
      console.log('addCarbs:carbDelayCountDown = '+ this.carbDelayCountDown);
      this.carbDelayCountDown = this.carbDelay;
      console.log('addCarbs:carbDelayCountDown = '+ this.carbDelayCountDown);
      this.carbImpactCountDown = this.carbDurationMins;

      // Calculate Sine Sum
      this.carbSineSum = 0;
      this.carbSineInterval = Math.PI / this.carbDurationMins;
      for (var i=0; i <= Math.PI; i += this.carbSineInterval) {
        this.carbSineSum += Math.sin(i);
      }
      console.log('carbSineSum = ' + this.carbSineSum);
    };

    // Assume default time and default impact/hr
    BloodSugar.prototype.addExercise = function addExercise(intensity) {
      this.exerciseDelayCountDown = this.exerciseDelay;
      this.exerciseDurationOfImpact = this.exerciseDurationDefault;
      console.log('this.exercise = ' + this.exercise);
      console.log('this.exerciseImpactDefault = ' + this.exerciseImpactDefault);
      this.exercise =
          this.exerciseImpactDefault / (60 / this.exerciseDurationOfImpact);
      this.exercise *= this.exerciseIntensity[intensity];
      this.exerciseDurationCountDown = this.exerciseDurationOfImpact;
      console.log('exercise = ' + this.exercise);
      console.log('delay count down = ' + this.exerciseDelayCountDown);
      console.log('duration count down = ' + this.exerciseDurationCountDown);
    };

    return BloodSugar;
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = BloodSugar;
  } else {
    window.BloodSugar = BloodSugar;
  }
})();
