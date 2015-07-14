var uiKeyboard = document.querySelector("#keyboard");

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

var polyOsc = new Tone.PolySynth(6, Tone.PolyOsc).toMaster();
polyOsc.set({osc1: {volume: -999}, osc2: {volume: -999}});

keyboard.keyDown = function (note, frequency) {
	polyOsc.triggerAttack(note);
};
keyboard.keyUp = function (note, frequency) {
	polyOsc.triggerRelease(note);
};

var controlTarget = function(e) {
	console.log(e.target.parentElement.dataset.control);
	return e.target.parentElement.dataset.control;
}

var setLevel = function(e) {
	var osc = controlTarget(e);
	polyOsc.set(osc, {volume: e.target.value});
}
var setOscType = function(e) {
	var osc = controlTarget(e);
	polyOsc.set(osc, {type: e.target.value})
}
var setOscDetune = function(e) {
	var osc = controlTarget(e);
	polyOsc.set(osc, {detune: e.target.value})
}
var setFiltCutoff = function(e) {
	var filter = controlTarget(e);
	polyOsc.set(filter, {frequency: e.target.value});
}
var setFiltQ = function(e) {
	var filter = controlTarget(e);
	polyOsc.set(filter, {Q: e.target.value});
}

window.addEventListener("input", function(e) {
	e.preventDefault();
	console.log(e.target.value);
	if (e.target.name === "volume") {
		setLevel(e);
	} else if (e.target.name === "detune") {
		setOscDetune(e);
	} else if (e.target.name === "osc-type") {
		setOscType(e);
	} else if (e.target.name === "cutoff") {
		setFiltCutoff(e);
	} else if (e.target.name === "Q") {
		setFiltQ(e);
	}
});