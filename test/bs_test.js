// Test lib/bs.js

var assert = require('assert');
var BloodSugar = require('../lib/bs.js');

describe('BloodSugar - bs.js', function() {
  describe('Test Constructor', function() {
    var bs = new BloodSugar(123);

    it('should have no insulin on board', function() {
      assert.equal(0, bs.insulin);
      assert.equal(0, bs.insulinSineSum);
    });

    it('should have a blood sugar of 123', function() {
      assert.equal(123, bs.bloodSugar);
    });

    it('no drift', function() {
      assert.equal(false, bs.hasDrift);
    });

    it('no exercise', function() {
      assert.equal(false, bs.hasExercise);
    });

    it('no carbs', function() {
      assert.equal(false, bs.hasCarbs);
    });

    it('no stress', function() {
      assert.equal(false, bs.hasStress);
    });

    it('no hormones', function() {
      assert.equal(false, bs.hasHormones);
    });

    it('no dawn effect', function() {
      assert.equal(false, bs.hasDawnEffect);
    });
  });

  describe('Test Drift Toggle', function() {
    it('Default Values', function() {
      var bs = new BloodSugar(123);
      assert.equal(false, bs.hasDrift);
      assert.equal(0, bs.maxDrift);
    });

    it('Turn on drift', function() {
      var bs = new BloodSugar(123);
      var md = 5;
      bs.turnOnDrift(md);
      assert.equal(true, bs.hasDrift);
      assert.equal(md, bs.maxDrift);
    });

    it('Turn off drift', function() {
      var bs = new BloodSugar(123);
      bs.turnOnDrift(5);
      bs.turnOffDrift();
      assert.equal(false, bs.hasDrift);
      assert.equal(0, bs.maxDrift);
    });

    it('Drift with no parameter', function() {
      var bs = new BloodSugar(123);
      bs.turnOnDrift();
      assert.equal(true, bs.hasDrift);
      assert.equal(0, bs.maxDrift);
    });

    it('Turn on Drift but pass in zero', function() {
      var bs = new BloodSugar(123);
      bs.turnOnDrift(0);
      assert.equal(true, bs.hasDrift);
      assert.equal(0, bs.maxDrift);
    });
  });

  describe('Test Exercise Toggle', function() {
    var exercise = 20; // decrease 20 points per hour
    var doi = 3; // Exercise duration of impact - 3 hours

    it('Default Values', function() {
      var bs = new BloodSugar(123);
      assert.equal(false, bs.hasExercise);
      assert.equal(0, bs.exercise);
      assert.equal(0, bs.exerciseDurationOfImpact);
    });

    it('Turn on exercise', function() {
      var bs = new BloodSugar(123);
      bs.turnOnExercise(exercise, doi);
      assert.equal(true, bs.hasExercise);
      assert.equal(exercise, bs.exercise);
      assert.equal(doi, bs.exerciseDurationOfImpact);
    });

    it('Turn on exercise with low intensity', function() {
      var bs = new BloodSugar(123);
      bs.turnOnExerciseIntensity(exercise, doi, 0);
      assert.equal(true, bs.hasExercise);
      assert.equal(exercise * bs.exerciseIntensity[0], bs.exercise);
      assert.equal(doi, bs.exerciseDurationOfImpact);
    });

    it('Turn on exercise with medium intensity', function() {
      var bs = new BloodSugar(123);
      bs.turnOnExerciseIntensity(exercise, doi, 1);
      assert.equal(true, bs.hasExercise);
      assert.equal(exercise * bs.exerciseIntensity[1], bs.exercise);
      assert.equal(doi, bs.exerciseDurationOfImpact);
    });

    it('Turn on exercise with high intensity', function() {
      var bs = new BloodSugar(123);
      bs.turnOnExerciseIntensity(exercise, doi, 2);
      assert.equal(true, bs.hasExercise);
      assert.equal(exercise * bs.exerciseIntensity[2], bs.exercise);
      assert.equal(doi, bs.exerciseDurationOfImpact);
    });

    it('check intensity levels', function() {
      var bs = new BloodSugar(123);
      assert.equal(3, bs.exerciseIntensity.length);
    });

    it('Turn off exercise', function() {
      var bs = new BloodSugar(123);
      bs.turnOnExercise(exercise, doi);
      bs.turnOffExercise();
      assert.equal(false, bs.hasExercise);
      assert.equal(0, bs.exercise);
      assert.equal(0, bs.exerciseDurationOfImpact);
    });
  });

  describe('Test Carbs Toggle', function() {
    it('Default Values', function() {
      var bs = new BloodSugar(123);
      assert.equal(false, bs.hasCarbs);
      assert.equal(0, bs.carbs);
    });

    it('Turn on carbs', function() {
      var bs = new BloodSugar(123);
      var ci = bs.carbImpact;
      var carbs = 20;
      bs.turnOnCarbs(carbs);
      assert.equal(true, bs.hasCarbs);
      assert.equal(carbs, bs.carbs);
      // carbImpact should not be changed
      assert.equal(ci, bs.carbImpact);
    });

    it('Turn on carbs with no parameter', function() {
      var bs = new BloodSugar(123);
      var ci = bs.carbImpact;
      bs.turnOnCarbs();
      assert.equal(true, bs.hasCarbs);
      assert.equal(0, bs.carbs);
      // carbImpact should not be changed
      assert.equal(ci, bs.carbImpact);
    });

    it('Turn on carbs with impact', function() {
      var bs = new BloodSugar(123);
      var nci = 1000;
      var carbs = 20;
      bs.turnOnCarbsWithImpact(carbs, nci);
      assert.equal(true, bs.hasCarbs);
      assert.equal(carbs, bs.carbs);
      assert.equal(nci, bs.carbImpact);
    });

    it('Turn on carbs with impact with no parameters', function() {
      var bs = new BloodSugar(123);
      var carbs = 20;
      bs.turnOnCarbsWithImpact(carbs);
      assert.equal(true, bs.hasCarbs);
      assert.equal(carbs, bs.carbs);
      assert.equal(0, bs.carbImpact);
      bs.turnOffCarbs();
      bs.turnOnCarbsWithImpact();
      assert.equal(true, bs.hasCarbs);
      assert.equal(0, bs.carbs);
      assert.equal(0, bs.carbImpact);
    });

    it('Turn off carbs', function() {
      var bs = new BloodSugar(123);
      var ci = bs.carbImpact;
      bs.turnOnCarbs(20);
      bs.turnOffCarbs();
      assert.equal(false, bs.hasCarbs);
      assert.equal(0, bs.carbs);
      assert.equal(ci, bs.carbImpact);
    });

    it('Turn off carbs with impact', function() {
      var bs = new BloodSugar(123);
      var ci = bs.carbImpact;
      bs.turnOnCarbs(20, 10000);
      bs.turnOffCarbs();
      assert.equal(false, bs.hasCarbs);
      assert.equal(0, bs.carbs);
      assert.equal(ci, bs.carbImpact);
    });
  });

  describe('Test Stress Toggle', function() {
    it('Default Values', function() {
      var bs = new BloodSugar(123);
      assert.equal(false, bs.hasStress);
      assert.equal(0, bs.stress);
      assert.equal(0, bs.stressDurationOfImpact);
    });

    it('Turn on stress', function() {
      var bs = new BloodSugar(123);
      bs.turnOnStress(10, 60);
      assert.equal(true, bs.hasStress);
      assert.equal(10, bs.stress);
      assert.equal(60, bs.stressDurationOfImpact);
    });

    it('Turn off stress', function() {
      var bs = new BloodSugar(123);
      bs.turnOnStress(10, 60);
      bs.turnOffStress();
      assert.equal(false, bs.hasStress);
      assert.equal(0, bs.stress);
      assert.equal(0, bs.stressDurationOfImpact);
    });
  });

  describe('Test Hormone Toggle', function() {
    it('Default Values', function() {
      var bs = new BloodSugar(123);
      assert.equal(false, bs.hasHormones);
      assert.equal(0, bs.hormones);
    });

    it('Turn on hormones', function() {
      var bs = new BloodSugar(123);
      bs.turnOnHormones(30);
      assert.equal(true, bs.hasHormones);
      assert.equal(30, bs.hormones);
    });

    it('Turn off hormones', function() {
      var bs = new BloodSugar(123);
      bs.turnOnHormones(30);
      bs.turnOffHormones();
      assert.equal(false, bs.hasHormones);
      assert.equal(0, bs.hormones);
    });
  });

  describe('Test Dawn Effect Toggle', function() {
    it('Default Values', function() {
      var bs = new BloodSugar(123);
      assert.equal(false, bs.hasDawnEffect);
      assert.equal(0, bs.dawnEffect);
      assert.equal(3, bs.dawnEffectStart); // Starts at 3am
      assert.equal(6, bs.dawnEffectStop); // Stops at 6am
    });

    it('Turn on dawn effect', function() {
      var bs = new BloodSugar(123);
      bs.turnOnDawnEffect(25);
      assert.equal(true, bs.hasDawnEffect);
      assert.equal(25, bs.dawnEffect);
      assert.equal(3, bs.dawnEffectStart);
      assert.equal(6, bs.dawnEffectStop);
    });

    it('Turn on dawn effect with timeframe', function() {
      var bs = new BloodSugar(123);
      bs.turnOnDawnEffectWithTime(25, 2, 5);
      assert.equal(true, bs.hasDawnEffect);
      assert.equal(25, bs.dawnEffect);
      assert.equal(2, bs.dawnEffectStart);
      assert.equal(5, bs.dawnEffectStop);
    });

    it('Turn off dawn effect', function() {
      var bs = new BloodSugar(123);
      bs.turnOnDawnEffect(25);
      bs.turnOffDawnEffect();
      assert.equal(false, bs.hasDawnEffect);
      assert.equal(0, bs.dawnEffect);
      assert.equal(3, bs.dawnEffectStart); // Starts at 3am
      assert.equal(6, bs.dawnEffectStop); // Stops at 6am
    });
  });

  describe('Add Insulin', function() {
    var bs = new BloodSugar(123);
    it('Add insulin function', function() {
      bs.addInsulin(1);
      assert.equal(1, bs.insulin);
      assert.equal(60, bs.insulinDelay);
      assert.equal(3, bs.insulinDurationHrs);
      assert.equal(180, bs.insulinDurationMins);
      assert.notEqual(0, bs.insulinSineSum);
      assert.notEqual(0, bs.insulinDelayCountDown);
      assert.notEqual(0, bs.insulinDoseCountDown);
    });
  });

  describe('Add Insulin with Delay', function() {
    var bs = new BloodSugar(123);
    it('Add insulin function with delay', function() {
      bs.addInsulinWithDelay(2, 45);
      assert.equal(2, bs.insulin);
      assert.equal(45, bs.insulinDelay);
      assert.equal(3, bs.insulinDurationHrs);
      assert.equal(180, bs.insulinDurationMins);
      assert.notEqual(0, bs.insulinSineSum);
      assert.notEqual(0, bs.insulinDelayCountDown);
      assert.notEqual(0, bs.insulinDoseCountDown);
    });
  });

  describe('Add Exercise - Low', function() {
    var bs = new BloodSugar(123);
    it('Add exercise function - Low intensity', function() {
      bs.addExercise(0);
      assert.equal(10, bs.exerciseDelayCountDown);
      assert.equal(30, bs.exerciseDurationOfImpact);
      assert.equal(20, bs.exerciseImpactDefault);
      assert.equal(1, bs.exerciseIntensity[0]);
      assert.equal(3, bs.exerciseIntensity.length);
      assert.equal(10, bs.exercise); // ExerciseImpactDefault / (60 / Duration of impact) * intensity
      assert.equal(30, bs.exerciseDurationCountDown);
    });
  });

  describe('Add Exercise - Medium', function() {
    var bs = new BloodSugar(123);
    it('Add exercise function - Medium intensity', function() {
      bs.addExercise(1);
      assert.equal(10, bs.exerciseDelayCountDown);
      assert.equal(30, bs.exerciseDurationOfImpact);
      assert.equal(20, bs.exerciseImpactDefault);
      assert.equal(2, bs.exerciseIntensity[1]);
      assert.equal(3, bs.exerciseIntensity.length);
      assert.equal(20, bs.exercise); // ExerciseImpactDefault / (60 / Duration of impact) * intensity
      assert.equal(30, bs.exerciseDurationCountDown);
    });
  });

  describe('Add Exercise - High', function() {
    var bs = new BloodSugar(123);
    it('Add exercise function - High intensity', function() {
      bs.addExercise(2);
      assert.equal(10, bs.exerciseDelayCountDown);
      assert.equal(30, bs.exerciseDurationOfImpact);
      assert.equal(20, bs.exerciseImpactDefault);
      assert.equal(4, bs.exerciseIntensity[2]);
      assert.equal(3, bs.exerciseIntensity.length);
      assert.equal(40, bs.exercise); // ExerciseImpactDefault / (60 / Duration of impact) * intensity
      assert.equal(30, bs.exerciseDurationCountDown);
    });
  });

  describe('Add Carbs', function() {
    var bs = new BloodSugar(123);
    it('Add carbs', function() {
      bs.addCarbs(10);
      assert.equal(10, bs.carbs);
      assert.equal(20, bs.carbDurationMins);
      assert.equal(5, bs.carbDelayCountDown);
      assert.equal(20, bs.carbImpactCountDown);
    });
  });

  describe('calcDrift()', function() {
    var bs = new BloodSugar(123);
    assert.equal(0, bs.calcDrift());

    bs.turnOnDrift(10);

    it('calcDrift', function() {
      var maxDriftPerTick = bs.maxDrift / 60;
      var n;
      for (n = 0; n < 50000; n++) {
        var d = bs.calcDrift();
        assert.ok(d > (-1 * maxDriftPerTick));
        assert.ok(d < maxDriftPerTick);
      }
    });
  });
});
