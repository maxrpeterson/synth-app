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

var polyOsc = new Tone.PolySynth(6, Tone.PolyOsc).toMaster();
polyOsc.set({osc1: {volume: -999}, osc2: {volume: -999}});

keyboard.keyDown = function (note, frequency) {
	polyOsc.triggerAttack(note);
};
keyboard.keyUp = function (note, frequency) {
	polyOsc.triggerRelease(note);
};

// function RadialDial(control) {
// 	var dial = document.createElement()
// 	this.
// }
