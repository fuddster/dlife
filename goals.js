/* @flow */
var goals = [];

/*
	List of goal types - Combine for more complex types

	between - "above 100", "below 180"
	breakfast - "below 150", "carb 50"
*/
var typeList = {
	equals: 0,
	above: 1,
	below: 2,
	bolus: 3,
	carb: 4
}

function evalEquals(hist) {
	console.log("evalEquals() - this = " + this.constructor.name);
	var len = hist.length;

	console.log("evalEquals:len = "+len);
	console.log("evalEquals:"+hist);

	if (this.duration > len) { return false; }

	var ret = true;

	for (var i = len; i > (len - this.duration); i--) {
		console.log("evalEquals:hist["+(i-1)+"]("+hist[(i-1)]+") equals "+this.target+"?");
		if (hist[(i-1)] != this.target) {
			ret = false;
		}
	}
	return ret;
}

function evalAbove(hist) {
	console.log("evalAbove() - this = " + this.constructor.name);
	var len = hist.length;

	console.log("evalAbove:len = "+len);
	console.log("evalAbove:"+hist);

	if (this.duration > len) { return false }

	var ret = true;

	for (var i = len; i > (len - this.duration); i--) {
		console.log("evalAbove:hist["+(i-1)+"]("+hist[i-1]+") equals "+this.target+"?");
		if (hist[(i-1)] <= this.target) {
			ret = false;
		}
	}
	return ret;
}

function evalBelow(hist) {
	console.log("evalBelow() - this = " + this.constructor.name);
	var len = hist.length;
	
	console.log("evalBelow:len = "+len);
	console.log("evalBelow:"+hist);

	if (this.duration > len) { return false }

	var ret = true;

	for (var i = len; i > (len - this.duration); i--) {
		console.log("evalBelow:hist["+(i-1)+"]("+hist[i-1]+") equals "+this.target+"?");
		if (hist[(i-1)] >= this.target) {
			ret = false;
		}
	}
	return ret;
}

function evalBolus(hist) {
	console.log("evalBolus() - this = " + this.constructor.name);
}

function evalCarb(hist) {
	console.log("evalCarbs() - this = " + this.constructor.name);
}

function markComplete() {
	console.log("markComplete() - this = " + this.constructor.name);
	this.complete = true;
}

function Goal(name="noName", type=0, target=100, duration=1) {
	console.log("Goal() - this = " + this.constructor.name);
	this.name = name;
	this.type = type;
	this.target = target;
	this.duration = duration;
	this.complete = false;
	this.markComplete = markComplete;

	if (type === 0) {
		this.func = evalEquals;
	} else if (type === 1) {
		this.func = evalAbove;
	} else if (type === 2) {
		this.func = evalBelow;
	} else if (type === 3) {
		this.func = evalBolus;
	} else if (type === 4) {
		this.func = evalCarb;
	}
}

function addGoal(name, type=0, target=100, duration=1) {
	console.log("addGoal() - this = " + this.constructor.name);
	goals.push(new Goal(name, type, target, duration));
}

function goalsComplete(hist) {
	console.log("goalsComplete() - this = " + this.constructor.name);
	for(var i=0; i < goals.length; i++) {
		console.log("goal name = "+goals[i].name);
		if (!goals[i].func(hist)) {
			return false;
		}
	}
	
	return true;
}

function goalsList() {
	console.log("goalsList() - this = " + this.constructor.name);
	for(var i=0; i < goals.length; i++) {
		console.log(goals[i]);
	}
}
