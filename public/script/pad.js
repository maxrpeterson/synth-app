
var ampEnv = new Tone.AmplitudeEnvelope({
	attack: 0.2,
	decay: 0.0,
	sustain: 1.0,
	release: 0.5
}).toMaster();

var osc = new Tone.OmniOscillator(110, "sawtooth").connect(ampEnv).start();

var randButton = document.querySelector("button#start-note");

randButton.addEventListener("mousedown", function() {
	ampEnv.triggerAttack();
});
randButton.addEventListener("mouseup", function() {
	ampEnv.triggerRelease();
});



// noise pad stuff
var noisePad = document.querySelector("#noise-pad");

var padOsc = new Tone.OmniOscillator(440, "sawtooth").toMaster();

var mousemove = function(e) {
	padOsc.frequency.value = e.clientX;
	padOsc.volume.value = (e.clientY * 0.1 - 50);
	// var val = 256 * (e.clientY * 0.001);
	// e.target.style.backgroundColor = "rgb(" + val + "," + val + "," + val + ")"
};

noisePad.addEventListener("mousedown", function(e) {
	padOsc.frequency.value = e.clientX;
	padOsc.volume.value = (e.clientY * 0.1 - 50);

	padOsc.start();
	noisePad.addEventListener("mousemove", mousemove);
});
noisePad.addEventListener("mouseup", function() {
	padOsc.stop();
	noisePad.removeEventListener("mousemove", mousemove);
});

