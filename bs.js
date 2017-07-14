/* @flow */
function BloodSugar(initialValue) {
	this.hasDrift = false;
	this.hasExercise = false;
	this.hasCarbs = false;
	this.hasStress = false;
	this.hasHormones = false;
	this.hasDawnEffect = false;

	this.maxDrift = 0; // max drift per hr

	// Exercise Constants
	this.exercise = 0;
	this.exerciseImpactDefault = 20; // exercise impact per hr for light exercise
	this.exerciseDurationDefault = 30; // Default duration to 30 minutes
	this.exerciseDurationOfImpact = 0; // hrs of exercise impact
	this.exerciseIntensity = [ 1, 2, 4]; // Light (1x), Medium (2x), Strenuous (4x)
	this.exerciseDelay = 10; // Delay before exercise impact start
	this.exerciseDelayCountDown = this.exerciseDefault;
	this.exerciseDurationCountDown = 0;

	this.stress = 0; // impact of stress on bs
	this.stressDurationOfImpact = 0; // hrs of stress impact
	this.horomones = 0; // impact of homones per hr
	this.dawnEffect = 0; // dawn effect per hr
	this.dawnEffectStart = 3; // hr of start of dawn effect (0-23)
	this.downEffectStop = 6; // hr of end of dawn effect (0-23)

	// Blood Sugar
	this.bloodSugar = initialValue;

	// Insulin Constants
	// @todo switch to array so multiple dosing can be tracked
	this.insulinDelay = 60; // How long before insulin starts impacting bs in minutes - Constant
	this.insulinSensitivityFactor = 30; // 1:x - 1 unit of insulin brings down bs by x
	this.insulinToCarbRatio = 10; //I:C Ratio set to 1:10
	this.insulinDurationHrs = 3; // How long the insulin lasts in hrs
	this.insulinDurationMins = this.insulinDurationHrs * 60;
	this.insulinSineSum = 0;
	this.sineInterval = 0;

	// Carb constants
	this.carbs = 0; // grams of carbs
	this.carbImpact = this.insulinSensitivityFactor / this.insulinToCarbRatio; // impact on bs per carb (i.e. 1 carb = +3 BS points)
	this.carbDelay = 5; // 5 minutes for quick sugar
	this.carbDurationMins = 15; // 15 minutes for quick sugar
	this.carbDelayCountDown = this.carbDelay;
	this.carbImpactCountDown = this.carbDurationMins;
	this.carbSineSum = 0;
	this.carbSineInterval = 0;

	// Insulin variables
	this.insulinDelayCountDown = this.insulinDelay; // Count down to insulin inpact
	console.log('Init:InsulinDelayCountDown = '+this.insulinDelayCountDown);
	this.insulinDoseCountDown = this.insulinDurationMins;
	console.log('Init:InsulinDelayCountDown = '+this.insulinDelayCountDown);
	this.insulin = 0;

	// Tick
	this.tickValue = 1; // in minutes

	this.eatTimer = null;

	this.view = view;
	this.bs_tick = bs_tick;
	this.addInsulin = bs_addInsulin;
	this.addInsulinWithDelay = bs_addInsulinWithDelay;
	this.addCarbs = bs_addCarbs;
}

function view() {
	with (this) console.log('view:bs = '+bloodSugar);
	console.log('InsulinDelayCountDown = '+this.insulinDelayCountDown);
}

function bs_turnOnDrift(maxDrift) {
	this.hasDrift = true;
	this.maxDrift = maxDrift;
}

function bs_turnOffDrift() {
	this.hasDrift = false;
	this.maxDrift = 0;
}

function bs_turnOnExercise(exercise, exerciseDurationOfImpact) {
	this.hasExercise = true;
	this.exercise = exercise;
	this.exerciseDurationOfImpact = exerciseDurationOfImpact;
}

function bs_turnOnExerciseIntensity(exercise, exerciseDurationOfImpact, exerciseIntensity) {
	this.hasExercise = true;
	this.exercise = exercise * this.exerciseIntensity[exerciseIntensity];
	this.exerciseDurationOfImpact = exerciseDurationOfImpact;
}

function bs_turnOffExercise() {
	this.hasExercise = false;
	this.exercise = 0;
	this.exerciseDurationOfImpact = 0;
}

function bs_turnOnCarbs(carbs) {
	this.hasCarbs = true;
	this.carbs = carbs;
}

function bs_turnOnCarbs(carbs, carbsImpact) {
	this.hasCarbs = true;
	this.carbs = carbs;
	this.carbsImpact = carbsImpact;
}

function bs_turnOffCarbs() {
	this.hasCarbs = false;
	this.carbs = 0;
}

function bs_turnOnStress(stress, stressDurationOfImpact) {
	this.hasStress = true;
	this.stress = stress;
	this.stressDurationOfImpact = stressDurationOfImpact;
}

function bs_turnOffStress() {
	this.hasStress = false;
	this.stress = 0;
	this.stressDurationOfImpact = 0;
}

function bs_turnOnHormones(hormones) {
	this.hasHormones = true;
	this.hormones = hormones;
}

function bs_turnOffHormones() {
	this.hasHormones = false;
	this.hormones = 0;
}

function bs_turnOnDawnEffect(dawnEffect) {
	this.hasDawnEffect = true;
	this.dawnEffect = dawnEffect;
}

function bs_turnOnDawnEffect(dawnEffect, dawnEffectStart, dawnEffectStop) {
	this.hasDawnEffect = true;
	this.dawnEffect = dawnEffect;
	this.dawnEffectStart = dawnEffectStart;
	this.dawnEffectStop = dawnEffectStop;
}

function bs_turnOffDawnEffect() {
	this.hasDawnEffect = false;
	this.dawnEffect = 0;
}

function bs_calcInsulinPercentageSine() {
	//
	// Sine insulin calculation   
	//    sine(0) to sine(180) area is 2 so divide by 2
	//    0-180 map to insulinDoseCountDown -> 0
	// insulin = (totalInsulin * (sine(insulinDoseCountDown) / 2)) * insulinSensitivityFactor * -1
	
}

function bs_tick() {
	// Move time forward one "tick"
	console.log('Starting BS = '+this.bloodSugar);

	// Insulin
	var i = 0;
	var p = 0;
	console.log('If:InsulinDelayCountDown = '+this.insulinDelayCountDown);
	if ((this.insulinDelayCountDown > 0) && (this.insulinDoseCountDown > 0)) {
		this.insulinDelayCountDown = this.insulinDelayCountDown - 1;
	} else {
		if ((this.insulinDoseCountDown > 0) && (this.insulin > 0)) {
			// Calc #1 - Straight line 
			// insulin effect = (insulin / insulinDurationMins) * insulinSensitivityFactor * -1
			// i = (this.insulin * percentage) * this.insulinSensitivityFactor * -1;
			//p = 1 / this.insulinDurationMins;
			
			// Calc #2 - Sine curve
			// insulin effect = insulin * (Sin(insulinDoseCountDown) / insulinSineSum) * insulinSensitivityFactor * -1
			p = Math.sin(this.insulinDoseCountDown * this.sineInterval) / this.insulinSineSum;
			console.log("Percentage = " + p);
			i = (this.insulin * p) * this.insulinSensitivityFactor * -1;
			console.log("insulin = " + i);
			this.insulinDoseCountDown--;
			console.log('DoseCountDown = '+this.insulinDoseCountDown);
			console.log('Dose = '+this.insulin);
		}
	}

	// Carbs
	var c = 0;
	console.log('If:carbDelayCountDown = '+this.carbDelayCountDown);
	if ((this.carbDelayCountDown > 0) && (this.carbImpactCountDown > 0)) {
		this.carbDelayCountDown = this.carbDelayCountDown - 1;
	} else {
		if ((this.carbImpactCountDown > 0) && (this.carbs > 0)) {
			// Calc #1 - Straight line 
			// insulin effect = (insulin / insulinDurationMins) * insulinSensitivityFactor * -1
			// i = (this.insulin * percentage) * this.insulinSensitivityFactor * -1;
			//p = 1 / this.insulinDurationMins;

			// Calc #2 - Sine curve
			// insulin effect = insulin * (Sin(insulinDoseCountDown) / insulinSineSum) * insulinSensitivityFactor * -1
			p = Math.sin(this.carbImpactCountDown * this.carbSineInterval) / this.carbSineSum;
			console.log("Percentage = " + p);
			c = (this.carbs * p) * this.carbImpact;
			console.log("carbs = " + c);
			this.carbImpactCountDown--;
			console.log('carbImpactCountDown = '+this.carbImpactCountDown);
			console.log('Carbs = '+this.carbs);
		}
	}

	// Drift
	var d = 0;
	if (this.hasDrift) {
		d = Math.random() * (this.maxDrift / 60);
		if (Math.random() < 0.5) {
			d *= -1;
		}
		console.log('drift = '+d);
	}

	// Exercise
	var e = 0;
	console.log("Exercise Delay Countdown = "+this.exerciseDelayCountDown);
	console.log("Exercise Duration Countdown = "+this.exerciseDurationCountDown);
	if ((this.exerciseDelayCountDown > 0) && (this.exerciseDurationCountDown > 0)) {
		this.exerciseDelayCountDown += -1;
	} else {
		if (this.exerciseDurationCountDown > 0) {
			console.log("Exercise = " + this.exercise);
			console.log("Exercise duration = "+ this.exerciseDurationOfImpact);
			e = this.exercise / this.exerciseDurationOfImpact;
			e *= -1;
			console.log("Exercise Impact (e) = "+e);
			this.exerciseDurationCountDown -= 1;
		}
	}

	this.bloodSugar += i;
	this.bloodSugar += d;
	this.bloodSugar += c;
	this.bloodSugar += e;

	//Fix Negative Number Bug
	if (this.bloodSugar < 0) { 
		this.bloodSugar = 0;
	}

	console.log('New BS = '+this.bloodSugar);
}

function bs_addInsulin(units) {
	this.insulin = units;
	console.log('addInsulin:InsulinDelayCountDown = '+this.insulinDelayCountDown);
	this.insulinDelayCountDown = this.insulinDelay;
	console.log('addInsulin:InsulinDelayCountDown = '+this.insulinDelayCountDown);
	this.insulinDoseCountDown = this.insulinDurationMins;

	// Calculate Sine Sum
	this.insulinSineSum = 0;
	this.sineInterval = Math.PI / this.insulinDurationMins;
	for (var i=0; i <= Math.PI; i += this.sineInterval) {
		var s = Math.sin(i);
		this.insulinSineSum += Math.sin(i);
	}
	console.log("InsulinSineSum = "+this.insulinSineSum);
	this.carbs = 0;
}

function bs_addInsulinWithDelay(units, delay) {
	this.insulin = units;
	this.insulinDelay = delay;
	console.log('addInsulin2:InsulinDelayCountDown = '+this.insulinDelayCountDown);
	this.insulinDelayCountDown = this.insulinDelay;
	console.log('addInsulin2:InsulinDelayCountDown = '+this.insulinDelayCountDown);
	this.insulinDoseCountDown = this.insulinDurationMins;

	// Calculate Sine Sum
	this.insulinSineSum = 0;
	this.sineInterval = Math.PI / this.insulinDurationMins;
	for (var i=0; i <= Math.PI; i += this.sineInterval) {
		var s = Math.sin(i);
		this.insulinSineSum += Math.sin(i);
	}
	console.log("InsulinSineSum = "+this.insulinSineSum);
}

function bs_addCarbs(carbs, when=0, msg=null, delay=5000) {
	console.log("addCarbs: carbs = "+carbs+"  when: "+when+"  msg: "+msg);
	if (when > 0) {
			var del = when * delay;
			console.log("addCarbs: when: "+when);
			console.log("addCarbs: delay: "+delay);
			console.log("addCarbs: del = "+del);
			console.log('this is:' + this.constructor.name)
			this.eatTimer = setTimeout(function(d) { this.bs_addCarbs(carbs, 0, msg); }, del);
			return;
	}
	if (msg != null) {
		alert(msg);
	}
	console.log('this is:' + this.constructor.name)
	this.carbs = carbs;
	this.carbDurationMins = 2 * this.carbs; // Duration is 2 minutes for every 1 carb (5 carbs = 10 min; 30 carbs = 1 hr; etc)
	console.log('addCarbs:carbDelayCountDown = '+this.carbDelayCountDown);
	this.carbDelayCountDown = this.carbDelay;
	console.log('addCarbs:carbDelayCountDown = '+this.carbDelayCountDown);
	this.carbImpactCountDown = this.carbDurationMins;

	// Calculate Sine Sum
	this.carbSineSum = 0;
	this.carbSineInterval = Math.PI / this.carbDurationMins;
	for (var i=0; i <= Math.PI; i += this.carbSineInterval) {
		var s = Math.sin(i);
		this.carbSineSum += Math.sin(i);
	}
	console.log("carbSineSum = "+this.carbSineSum);
}

// Assume default time and default impact/hr
function bs_addExercise(intensity) {
	this.exerciseDelayCountDown = this.exerciseDelay;
	this.exerciseDurationOfImpact = this.exerciseDurationDefault;
	console.log("this.exercise = "+this.exercise);
	console.log("this.exerciseImpactDefault = "+this.exerciseImpactDefault);
	this.exercise = this.exerciseImpactDefault / (60 / this.exerciseDurationOfImpact);
	this.exercise *= this.exerciseIntensity[intensity];
	this.exerciseDurationCountDown = this.exerciseDurationOfImpact;
	console.log("exercise = "+this.exercise);
	console.log("delay count down = "+this.exerciseDelayCountDown);
	console.log("duration count down = "+this.exerciseDurationCountDown);
}

BloodSugar.prototype.view=view;
BloodSugar.prototype.tick=bs_tick;
BloodSugar.prototype.addInsulin=bs_addInsulin;
BloodSugar.prototype.addInsulinWithDelay=bs_addInsulinWithDelay;
BloodSugar.prototype.addCarbs=bs_addCarbs;
BloodSugar.prototype.addExercise=bs_addExercise;
BloodSugar.prototype.turnOnDrift=bs_turnOnDrift;
