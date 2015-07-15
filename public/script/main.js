var uiKeyboard = document.querySelector("#keyboard");

// generate the keyboard, may change this later
// so i can make it a little better looking?
var keyboard = new QwertyHancock({
	id: 'keyboard',
	width: parseInt(window.innerWidth),
	height: parseInt(window.innerHeight / 3),
	octaves: 3,
	startNote: 'C3',
	whiteNotesColour: 'white',
	blackNotesColour: 'black',
	hoverColour: '#f3e939'
});
uiKeyboard.style.position = "absolute";
uiKeyboard.style.bottom = 0;
uiKeyboard.style.left = 0;

document.querySelector(".controls").style.height = (window.innerHeight / 3) * 2;

// create the synth
var polyOsc = new Tone.PolySynth(6, Tone.PolyOsc).toMaster();
polyOsc.set({osc1: {volume: -99}, osc2: {volume: -99},filter: {frequency: 20000},filterEnvelope: {max: 2000}});

// possible options to pass to templates
var waveforms = ["sine", "square", "triangle", "sawtooth", "pulse", "pwm"];
var filterTypes = ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "notch", "allpass", "peaking"];


// using templates
var oscTemplate = _.template(document.querySelector("#oscillator-template").innerHTML);
document.querySelector("#oscillators").innerHTML = template({synth: polyOsc.get(), waveforms: waveforms});

var filtTemplate = _.template(document.querySelector("#filter-template").innerHTML);
var filterHTML = filtTemplate({filterTypes: filterTypes});
var ampTemplate = _.template(document.querySelector("#amp-template").innerHTML);

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
	console.log(area, e.target.name);
	params[e.target.name] = parseFloat(e.target.value);
	polyOsc.set(area, params);
};

window.addEventListener("input", function(e) {
	console.log(e.target.value);
	if (e.target.tagName === "SELECT") {
		setType(e);
	} else if (e.target.tagName === "INPUT" && e.target.type === "range") {
		setRange(e);
	}
});

// knob handlers (har har), could probably be cleaned up a bit?
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
			increment = (range / 270);
		} else {
			increment = range / 270;
		}
		var newVal = baseValue + rotationDiff * increment;
		var params = {};
		params[targetKnob.dataset.control] = newVal;
		polyOsc.set(targetKnob.dataset.area, params);	
	}
};


var startChangeListener = function(event) {
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

window.addEventListener("mousedown", startChangeListener);