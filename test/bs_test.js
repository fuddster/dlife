// Test lib/bs.js

var assert = require('assert');
var BloodSugar = require('../lib/bs.js');

describe('bs.js', function() {
  describe('BloodSugar', function() {
    describe('Test Constructor', function() {

      var bs = new BloodSugar(123);

      it('should have no insulin on board', function() {
        assert.equal(0, bs.insulin);
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
        let md = 5;
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
    });

    describe('Test Exercise Toggle', function() {

      let exercise = 20;  // decrease 20 points per hour
      let doi = 3; // Exercise duration of impact - 3 hours

      it('Default Values', function() {
        var bs = new BloodSugar(123);
        assert.equal(false, bs.hasExercise);
        assert.equal(0, bs.exercise);
        assert.equal(0, bs.exerciseDurationOfImpact)
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
        let ci = bs.carbImpact;
        let carbs = 20;
        bs.turnOnCarbs(carbs);
        assert.equal(true, bs.hasCarbs);
        assert.equal(carbs, bs.carbs);
        // carbImpact should not be changed
        assert.equal(ci, bs.carbImpact);
      });

      it('Turn on carbs with impact', function() {
        var bs = new BloodSugar(123);
        let ci = bs.carbImpact;
        let nci = 1000;
        let carbs = 20;
        bs.turnOnCarbsWithImpact(carbs, nci);
        assert.equal(true, bs.hasCarbs);
        assert.equal(carbs, bs.carbs);
        assert.equal(nci, bs.carbImpact);
      });

      it('Turn off carbs', function() {
        let bs = new BloodSugar(123);
        let ci = bs.carbImpact;
        bs.turnOnCarbs(20);
        bs.turnOffCarbs();
        assert.equal(false, bs.hasCarbs);
        assert.equal(0, bs.carbs);
        assert.equal(ci, bs.carbImpact);
      });

      it('Turn off carbs with impact', function() {
        let bs = new BloodSugar(123);
        let ci = bs.carbImpact;
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

  });
});
