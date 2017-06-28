var bs_screen = {
	minuteCount:	1,
	bgCount: 		0,
	delay: 			100, // speed things up for testing
//	delay:          500,
//	delay: 			5000,
	paused: 		1, // Start paused
	minTimer:		null, // Interval to pass time
	goalTimer:		null, // Interval to check for success
	dotsPerHr: 		(60 / 5),  // Every 5 minutes
	hrs: 			12,
	n: 				0, // Number of items on y axis - For 12 hrs
	guideDotsPerHr:	2,
	numOfGuideDots:	24, // Default to 24
	lowLevel: 		80,
	highLevel: 		180,
	maxHigh: 		250,
	maxLow: 		40,
	interval: 		5, // 5 minutes per interval
	data:			[bs.bloodSugar],
	histData:       [bs.bloodSugar],
	textData: 		[bs.bloodSugar],
	svg:			null,
	margin:			null,
	width:			null,
	height:			null,
	xScale:			null,
	yScale:			null,
	lowLine: 		null,
	highLine: 		null,
	maxLowLine: 	null,
	maxHighLine: 	null,
	group:			null,
	bolusButtonOn:	false,
	carbButtonOn:	true,
	ISFOn:			false,
	ICROn:			false,


	setup: function() {
		console.log("Starting... D3 Version "+d3.version);
		console.log("BS Starting...");
		console.log("Starting data = " + this.data);		

		this.n = this.dotsPerHr * this.hrs, // Number of items on y axis - For 12 hrs
		this.numOfGuideDots = this.hrs * this.guideDotsPerHr, // Every 1/2 hr

		this.lowLine = d3.range(this.numOfGuideDots).map(function(d) { return bs_screen.lowLevel });
		this.highLine = d3.range(this.numOfGuideDots).map(function(d) { return bs_screen.highLevel });
		this.maxLowLine = d3.range(this.numOfGuideDots).map(function(d) { return bs_screen.maxLow });
		this.maxHighLine = d3.range(this.numOfGuideDots).map(function(d) { return bs_screen.maxHigh });

		this.svg = d3.select(".bgGraph");
		this.margin = {top: 120, right: 18, bottom: 20, left: 40};
		this.width = +this.svg.attr("width") - this.margin.left - this.margin.right;
		this.height = +this.svg.attr("height") - this.margin.top - this.margin.bottom;

		this.xScale = d3.scaleLinear()
			.domain([0, this.hrs])
			.range([0, this.width]);

		this.yScale = d3.scaleLinear()
			.domain([0, 260])
			.range([this.height, 0]);
	},
	
	setDelay: function(delay) {
		this.delay = delay;
	},

	draw: function() {
		this.group = this.svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

		var lineGroup = this.group.append("g");

		lineGroup.selectAll("lowDot")
			.data(this.lowLine)
			.enter().append("circle")
			.attr("class", "lowLine")
			.attr("r", 2)
			.attr("cx", function(d, i) { return bs_screen.xScale(i / bs_screen.guideDotsPerHr); } )
			.attr("cy", function(d, i) { return bs_screen.yScale(d); } );

		lineGroup.selectAll("highDot")
			.data(this.highLine)
			.enter().append("circle")
			.attr("class", "highLine")
			.attr("r", 2)
			.attr("cx", function(d, i) { return bs_screen.xScale(i / bs_screen.guideDotsPerHr); } )
			.attr("cy", function(d, i) { return bs_screen.yScale(d); } );

		lineGroup.selectAll("maxLowDot")
			.data(this.maxLowLine)
			.enter().append("circle")
			.attr("class", "maxLowLine")
			.attr("r", 2)
			.attr("cx", function(d, i) { return bs_screen.xScale(i / bs_screen.guideDotsPerHr); } )
			.attr("cy", function(d, i) { return bs_screen.yScale(d); } );

		lineGroup.selectAll("maxHighDot")
			.data(this.maxHighLine)
			.enter().append("circle")
			.attr("class", "maxHighLine")
			.attr("r", 2)
			.attr("cx", function(d, i) { return bs_screen.xScale(i / bs_screen.guideDotsPerHr); } )
			.attr("cy", function(d, i) { return bs_screen.yScale(d); } );

		this.group.append("g")
			.attr("class", "axis xAxis")
			.attr("transform", "translate(0," + this.yScale(0) + ")")
			.call(d3.axisBottom(this.xScale).ticks(25));

		this.group.append("g")
			.attr("class", "axis yAxis")
			.call(d3.axisLeft(this.yScale).ticks(6));

		this.group.selectAll(".bgDot")
			.data(this.data)
			.enter().append("circle")
			.attr("class", "bgDot")
			.attr("r", 3)
			.attr("cx", function(d, i) { return bs_screen.xScale(i / bs_screen.dotsPerHr); } )
			.attr("cy", function(d, i) { return bs_screen.yScale(d); } );

		// Display BGL on screen
		this.group.selectAll(".bgText")
			.data(this.textData)
			.enter()
			.append("text")
			.attr("class", "bgText")
			.text(function (d) { return d.toString(); })
			.attr("fill", function (d) {
				if ((d < bs_screen.highLevel) && (d > bs_screen.lowLevel)) { return "#0f0"; }
				if ((d >= bs_screen.maxHigh) || (d <= bs_screen.maxLow)) { return "#ff0"; }
				return "#f00";
			} )
			.attr("x", this.width - 300)
			.attr("y", -10);

		// Display start button
		this.group.append("text")
			.attr("class", "startButton")
			.text("Start")
			.attr("fill", "#0f0")
			.attr("x", 0)
			.attr("y", -30)
			.on("click", function(d) {
				console.log("paused = " + bs_screen.paused);
				if (bs_screen.paused) {
					console.log("Starting.");
					bs_screen.group.selectAll(".startButton")
						.attr("fill", "#f00")
						.text("Pause");
					bs_screen.group.selectAll(".bgGraph")
						.attr("fill", "#fff");
					bs_screen.startTimers();
					bs_screen.paused = 0;
				} else {
					console.log("Pausing.");
					bs_screen.group.selectAll(".startButton")
						.attr("fill", "#0f0")
						.text("Resume");
					bs_screen.group.selectAll(".bgGraph")
						.attr("fill", "#aa0");
					bs_screen.stopTimers();
					bs_screen.paused = 1;
				}
			} );

		// Display Bolus button
		this.group.append("text")
			.attr("class", "bolusButton")
			.text("Bolus")
			.attr("fill", "#00f")
			.attr("x", 160)
			.attr("y", -30)
			.attr("visibility", this.bolusButtonOn ? "visable" : "hidden")
			.on("click", function(d) {
				var bolus = prompt("Bolus in units", 1);
				if (bolus !== null) {
					if ((bolus !== null) && !isNaN(parseFloat(bolus)) && isFinite(bolus)) {
						bs.addInsulin(bolus); // Add 1 unit of insulin with a delay of 1 hr
						alert("Bolusing "+bolus+" unit"+(bolus==1)?"":"s"+" of insulin");
					} else {
						alert("That is not a number");
					}
				}
			} );

		// Display Eat button
		this.group.append("text")
			.attr("class", "eatButton")
			.text("Eat Carbs")
			.attr("fill", "#00f")
			.attr("x", 300)
			.attr("y", -30)
			.attr("visibility", this.bolusButtonOn ? "visable" : "hidden")
			.on("click", function(d) {
				var c = prompt("Carbs eaten", 10);
				if (c !== null) {
					if ((c !== null) && !isNaN(parseFloat(c)) && isFinite(c)) {
						bs.addCarbs(c); // Add 1 unit of insulin with a delay of 1 hr
						alert(c+" carb"+(c==1)?"":"s"+" eaten");
					} else {
						alert("That is not a number");
					}
				}
			} );

		// Display Insulin Sensitivity Factor
		this.group.append("text")
			.attr("class", "isf")
			.text("ISF - 1:"+bs.insulinSensitivityFactor)
			.attr("fill", "#f0f")
			.attr("x", 320)
			.attr("y", -80)
			.attr("visibility", this.ISFOn ? "visable" : "hidden");
		
		// Display Insulin:Carb Ratio
		this.group.append("text")
			.attr("class", "icr")
			.text("I:C Ratio - 1:"+bs.insulinToCarbRatio)
			.attr("fill", "#f0f")
			.attr("x", 470)
			.attr("y", -80)
			.attr("visibility", this.ICROn ? "visable" : "hidden");

	},

	enableBolus: function(delay = bs.insulinDelay) {
		console.log("Turn on bolus button");
		bs.insulinDelay = delay;
		this.group.select(".bolusButton")
			.attr("visibility", "visable");
		this.bolusButtonOn = true;
	},

	enableEating: function(ci = bs.carbImpact) {
		console.log("Turn on eat button");
		bs.carbImpact = ci;
		this.group.select(".eatButton")
			.attr("visibility", "visable");
		this.eatButtonOn = true;
	},

	displayISF: function() {
		console.log("Turn on ISF display");
		this.group.select(".isf")
			.attr("visibility", "visable");
		this.ISFOn = true;
	},
	
	displayICR: function() {
		console.log("Turn on I:C Ratio display");
		this.group.select(".icr")
			.attr("visibility", "visable");
		this.ICROn = true;
	},

	tock: function() {
		bs.tick();

		console.log("Count = " + this.minuteCount);
		console.log(" Data = " + this.data);
		console.log(" Hist = " + this.histData);

		if (this.minuteCount == this.interval) {
			var b = Math.round(bs.bloodSugar);
			this.data.push(b);
			this.histData.push(b)
			this.textData.push(b);
			this.textData.shift();

			console.log("shift? bgCount = " + this.bgCount + " n = " + this.n);
			if (this.bgCount < (this.n - 1)) {
				this.bgCount += 1;
			} else {
				console.log("Shift!");
				this.data.shift();
			}
			
			var bgDot = this.group.selectAll(".bgDot")
				.data(this.data)
				.attr("r", 3)
				.attr("cx", function(d, i) { return bs_screen.xScale(i / bs_screen.dotsPerHr); } )
				.attr("cy", function(d, i) { return bs_screen.yScale(d); } );

			bgDot.enter()
				.append("circle")
				.attr("class", "bgDot")
				.attr("r", 5)
				.attr("cx", function(d, i) { return bs_screen.xScale(i / bs_screen.dotsPerHr); } )
				.attr("cy", function(d, i) { return bs_screen.yScale(d); } );

			bgDot.exit().remove();
			
			var bgText = this.group.selectAll(".bgText")
				.data(this.textData)
				.text(function (d) { return d.toString() })
				.attr("fill", function (d) {
					if ((d < bs_screen.highLevel) && (d > bs_screen.lowLevel)) { return "#0f0"; }
					if ((d >= bs_screen.maxHigh) || (d <= bs_screen.maxLow)) { return "#ff0"; }
					return "#f00";
				} )
				.attr("x", this.width - 300)
				.attr("y", -10);

			bgText.enter()
				.append("text")
				.attr("class", "bgText")
				.text(function (d) { return d.toString(); })
				.attr("fill", function (d) {
					if ((d < bs_screen.highLevel) && (d > bs_screen.lowLevel)) { return "#0f0"; }
					if ((d >= bs_screen.maxHigh) || (d <= bs_screen.maxLow)) { return "#ff0"; }
					return "#f00";
				} )
				.attr("x", this.width - 300)
				.attr("y", -10);

			bgText.exit().remove();

			// STOP EXECUTION
			//clearInterval(this.minTimer);
			
			this.minuteCount = 1;
		} else {
			this.minuteCount += 1;
		}
	},
	
	stopTimers: function() {
		clearInterval(this.minTimer);
		clearInterval(this.goalTimer);
	},

	startTimers: function() {
		this.minTimer = setInterval(function() {
						bs_screen.tock(); 
					}, bs_screen.delay);
		this.goalTimer = setInterval(this.checkGoals, (this.delay * this.interval));
	},

	displaySuccess: function(message="Good Job") {
		// Display success message
		this.svg.append("rect")
			.attr("x", .1*this.width)
			.attr("y", .3*this.height)
			.attr("width", "80%")
			.attr("height", "40%")
			.attr("fill", "#578ad6");
		this.svg.append("text")
			.attr("class", "success")
			.text(message)
			.attr("fill", "#ff0")
			.attr("x", this.width/2)
			.attr("y", this.height/2)
			.attr("text-anchor", "middle");
	},

	checkGoals: function() {
		var s = 0;

		console.log("Checking goals");
//		console.log("Hist len = " + this.histData.length);
		console.log("Hist = " + bs_screen.histData);

		// determine if goals are met
		s = this.goalsComplete(bs_screen.histData);
		
		if (s) {
			bs_screen.displaySuccess("You did it!  Good Job!");
			bs_screen.stopTimers();
		}
	}

};

bs_screen.setup();

bs_screen.draw();

console.log("Finished screen.js");
