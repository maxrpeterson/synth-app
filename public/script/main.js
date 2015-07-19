window.addEventListener("load", function() {
	var uiKeyboard = document.querySelector("#keyboard");

	// generate the keyboard, may change this later
	// so i can make it a little better looking?
	var keyboard = new QwertyHancock({
		id: 'keyboard',
		width: parseInt(window.innerWidth),
		height: parseInt(window.innerHeight / 5),
		octaves: 3,
		startNote: 'C3',
		whiteNotesColour: 'white',
		blackNotesColour: 'black',
		hoverColour: '#f3e939'
	});
	uiKeyboard.style.position = "absolute";


	// create the synth
	var polyOsc = new Tone.PolySynth(6, Tone.PolyOsc);
	polyOsc.set({osc1: {volume: -99}, osc2: {volume: -99},filter: {frequency: 20000, Q: 0}});

	// effects
	var effects = {};
	effects.chorus = new Tone.Chorus(2, 2, 0.5);
	effects.chorus.set({wet: 0});
	effects.delay = new Tone.FeedbackDelay(0.5, 0.5);
	effects.delay.set({wet: 0});
	effects.reverb = new Tone.Freeverb(0.5, 200);
	effects.reverb.set({wet: 0});

	polyOsc.chain(effects.chorus, effects.delay, effects.reverb, Tone.Master);

	// possible options to pass to templates
	var waveforms = ["sine", "square", "triangle", "sawtooth", "pulse", "pwm"];
	var filterTypes = ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "notch", "allpass", "peaking"];


	// using templates
	var optionsTemplate = _.template(document.querySelector("#options-template").innerHTML);
	var oscTemplate = _.template(document.querySelector("#oscillator-template").innerHTML);
	document.querySelector("#oscillators").innerHTML = oscTemplate({synth: polyOsc.get(), waveforms: waveforms, optionsTemplate: optionsTemplate});

	document.querySelector(".filter select").innerHTML = optionsTemplate({options: filterTypes});


	var envelopeTemplate = _.template(document.querySelector("#envelope-template").innerHTML);

	document.querySelector("section.filter .envelope").innerHTML = envelopeTemplate({area: "filterEnvelope", env: polyOsc.get("filterEnvelope").filterEnvelope});
	document.querySelector("section.amp .envelope").innerHTML = envelopeTemplate({area: "envelope", env: polyOsc.get("envelope").envelope});

	// set the keydown/up handlers of the keyboard
	keyboard.keyDown = function (note, frequency) {
		polyOsc.triggerAttack(note);
	};
	keyboard.keyUp = function (note, frequency) {
		polyOsc.triggerRelease(note);
	};

	// handlers for select inputs
	var setType = function(e) {
		var area = e.target.dataset.area;
		polyOsc.set(area, {type: e.target.value});
	};
	var setRange = function(e) {
		var area = e.target.dataset.area;
		var params = {};
		params[e.target.name] = parseFloat(e.target.value);
		polyOsc.set(area, params);
		displayStatus(e.target.dataset.area + " " + e.target.name, parseFloat(e.target.value), e.target.dataset.units);
	};

	window.addEventListener("input", function(e) {
		if (e.target.tagName === "SELECT") {
			setType(e);
		} else if (e.target.tagName === "INPUT" && e.target.type === "range") {
			setRange(e);
		}
	});

	var setAttr = function(targetKnob, e) {
		// get the current rotate amount of the knob
		var currRotation = parseInt(targetKnob.style.transform.slice(7, -4));
		// convert the negative Y amount into a positive degree rotation
		var rotateAmount = -(e.movementY);
		var newRotation = currRotation + rotateAmount;
		// constrain the rotation to -135 to 135 degrees (270 total degrees)
		if (newRotation >= -135 && newRotation <= 135) {
			targetKnob.style.transform = "rotate(" + newRotation + "deg)";
			var baseValue = parseInt(targetKnob.dataset.basevalue);
			var rotationOrigin = parseInt(targetKnob.dataset.origin);
			var range = parseInt(targetKnob.dataset.max) - parseInt(targetKnob.dataset.min);
			var increment;
			var rotationDiff = newRotation - rotationOrigin;
			if (targetKnob.dataset.scale === "log") {
				// fix this
				increment = (range / 270) // / Math.pow(newRotation - rotationOrigin); ?
			} else if (targetKnob.dataset.scale === "exp") {
				increment = (range / 270) // / Math.pow(newRotation - rotationOrigin); ?
			} else {
				increment = range / 270;
			}
			var newVal = baseValue + rotationDiff * increment;
			var params = {};
			params[targetKnob.dataset.control] = newVal;
			if (targetKnob.dataset.effects) {
				effects[targetKnob.dataset.area].set(params)
			} else {
				polyOsc.set(targetKnob.dataset.area, params);
			}
			displayStatus(targetKnob.dataset.area + " " + targetKnob.dataset.control, newVal, targetKnob.dataset.units);
		}
	};

	// status bar
	var statusWindow = document.querySelector("#status");

	var displayStatus = function(context, val, units) {
		statusWindow.textContent = context;
		if (val !== undefined) {
			statusWindow.textContent += ": " + val;
			if (units !== undefined) {
				statusWindow.textContent += " " + units;
			}
		}
	};

	// start listening for mouse movement after clicking on a knob
	var startKnobListener = function(event) {
		if (event.target.tagName === "DIV" && event.target.classList.contains("knob")) {
			var stopChangeListener = function(e) {
				window.removeEventListener("mousemove", moveHandler);
				window.removeEventListener("mouseup", stopChangeListener);
			};
			var targetKnob = event.target;
			var moveHandler = function(e) {
				setAttr(targetKnob, e);
			};
			window.addEventListener("mousemove", moveHandler);
			window.addEventListener("mouseup", stopChangeListener);
		}
	};

	window.addEventListener("mousedown", startKnobListener);

	var meterDisplay = document.querySelector("div.meter");
	var meterContainer = document.querySelector("div.meter-container");

	var meter = new Tone.Meter();
	polyOsc.connect(meter);

	var setMeterDisplay = function() {
		meterDisplay.style.width = parseInt(meterContainer.offsetWidth * meter.getLevel()) + "px";
	};
	var meterInterval = window.setInterval(setMeterDisplay, 20);


	// SAVING & LOADING PATCHES //

	window.checkLogin = function() {
		FB.getLoginStatus(function(response) {
			statusChangeCallback(response);
		});
	};

	checkLogin();

	var userId;

	var statusChangeCallback = function(response) {
		if (response.status === "connected") {
			enableSaving();
			displayStatus("Status", "Logged In");
			userId = response.authResponse.userID;
		} else {
			disableSaving();
			userId = undefined;
			if (response.status === "not_authorized") {
				displayStatus("Status", "Authorize the Synth App to enable saving patches");
			} else if (response.status === "unknown") {
				displayStatus("Status", "Log In to save patches");
			}
		}
	};

	var saveLoadDiv = document.querySelector(".save-load");

	var disableSaving = function() {
		if (saveLoadDiv.hasChildNodes) {
			while(saveLoadDiv.firstChild) {
				saveLoadDiv.removeEventListener("click", saveLoadClickHandler)
				saveLoadDiv.removeChild(saveLoadDiv.firstChild);
			}
		}
	};

	var saveLoadClickHandler = function(e) {		
		if (e.target.id === "save") {
			savePatch();
		} else if (e.target.id === "load") {
			loadPatch();
		}
	};

	var enableSaving = function() {
		saveLoadDiv.innerHTML = '<li id="save">Save Patch</li><li id="load">Load Patch</li>';
		saveLoadDiv.addEventListener("click", saveLoadClickHandler);
	};

	var savePatch = function() {
		var effectsSettings = {chorus: effects.chorus.get(), delay: effects.delay.get(), reverb: effects.reverb.get()}
		var settingsObj = {synth: polyOsc.get(), user: userId, effects: effectsSettings};
		var ajaxPost = new XMLHttpRequest();
		ajaxPost.onreadystatechange = function() {
			if (ajaxPost.readyState === 2) {
				displayStatus("Saving...")
			} else if (ajaxPost.readyState === 4 && ajaxPost.status === 200) {
				var response = JSON.parse(ajaxPost.responseText);
				if (response.result.ok === 1) {
					var msg = "";
					if (response.result.nModified === 0 && response.result.upserted) {
						msg = "new patch";
					} else if (response.result.nModified === 1) {
						msg = "overwrote old patch";
					} else {
						msg = "already Up-to-date";
					}
					displayStatus("Saved", msg);
				} else {
					console.log(response);
					displayStatus("Something went wrong?");
				}
			}
		};
		ajaxPost.open('POST', '/presets');
		ajaxPost.setRequestHeader('Content-Type', 'application/json');
		var settingsStr = JSON.stringify(settingsObj)
		ajaxPost.send(settingsStr);
	};

	var loadPatch = function() {
		var ajaxGet = new XMLHttpRequest;
		ajaxGet.onreadystatechange = function() {
			if (ajaxGet.readyState === 2) {
				displayStatus("Loading...");
			} else if (ajaxGet.readyState === 4 && ajaxGet.status === 200) {
				var response = JSON.parse(ajaxGet.responseText);
				if (response.result === "not_found") {
					displayStatus("Error", "No patch found for current user");
				} else {
					polyOsc.set(response.result.synth);
					for (var prop in response.result.effects) {
						effects[prop].set(response.result.effects[prop]);
					}
					displayStatus("Loaded");
				}
			}
		};
		var url = '/presets/' + userId;
		ajaxGet.open('GET', url);
		ajaxGet.send(null);
	};

	// toggling the "about" section
	var aboutPane = document.querySelector("div.about");
	var aboutLink = document.querySelector("a.about-link");
	var escapeButton = document.querySelector(".escape");
	var toggleAboutPane = function(e) {
		aboutPane.classList.toggle("hide");
	};

	escapeButton.addEventListener("click", toggleAboutPane);
	aboutLink.addEventListener("click", toggleAboutPane);
	window.addEventListener("keydown", function(e) {
		if (e.which === 27) {
			aboutPane.classList.add("hide");
		}
	});

});