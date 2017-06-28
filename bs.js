function BloodSugar(initialValue) { 
	this.hasDrift = false;
	this.hasExercise = false;
	this.hasCarbs = false;
	this.hasStress = false;
	this.hasHormones = false;
	this.hasDawnEffect = false;

	this.maxDrift = 0; // max drift per hr
	this.exercise = 0; // exercise impact per hr
	this.exerciseDurationOfImpact = 0; // hrs of exercise impact
	this.stress = 0; // impact of stress on bs
	this.stressDurationOfImpact = 0; // hrs of stress impact
	this.horomones = 0; // impact of homones per hr
	this.dawnEffect = 0; // dawn effect per hr
	this.dawnEffectStart = 3; // hr of start of dawn effect (0-23)
	this.downEffectStop = 6; // hr of end of dawn effect (0-23)

	// Blood Sugar
	this.bloodSugar = initialValue;

	// Carb constants
	this.carbs = 0; // grams of carbs
	this.carbImpact = 2; // impact on bs per carb (i.e. 1 carb = +2 BS points)
	this.carbDelay = 5; // 5 minutes for quick sugar
	this.carbDurationMins = 15; // 15 minutes for quick sugar
	this.carbDelayCountDown = this.carbDelay;
	this.carbImpactCountDown = this.carbDurationMins;
	this.carbSineSum = 0;
	this.carbSineInterval = 0;

	// Insulin Constants
	// @todo switch to array so multiple dosing can be tracked
	this.insulinDelay = 60; // How long before insulin starts impacting bs in minutes - Constant
	this.insulinSensitivityFactor = 30; // 1:x - 1 unit of insulin brings down bs by x
	this.insulinDurationHrs = 3; // How long the insulin lasts in hrs
	this.insulinDurationMins = this.insulinDurationHrs * 60;
	this.insulinSineSum = 0;
	this.sineInterval = 0;

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

	this.bloodSugar += i;
	this.bloodSugar += d;
	this.bloodSugar += c;
	
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
	for (var i=0; i <= Math.PI; i += interval) {
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
			this.eatTimer = setTimeout(function(d) { bs_addCarbs(carbs, 0, msg); }, del);
			return;
	}
	if (msg != null) {
		alert(msg);
	}
	console.log('this is:' + this)
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

BloodSugar.prototype.view=view;
BloodSugar.prototype.tick=bs_tick;
BloodSugar.prototype.addInsulin=bs_addInsulin;
BloodSugar.prototype.addInsulinWithDelay=bs_addInsulinWithDelay;
BloodSugar.prototype.addCarbs=bs_addCarbs;
BloodSugar.prototype.turnOnDrift=bs_turnOnDrift;
