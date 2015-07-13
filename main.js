var keyboard = document.querySelector("#keyboard");

var polyOscSynth = new Tone.MonoSynth({
	oscillator: {
		type: "sawtooth",
		volume: 0.7
	},
	envelope: {
		attack: 0.1,
		decay: 0.0,
		sustain: 1.0,
		release: 0.5
	},
	volume: 0.8,
	filterEnvelope: {
		attack: 0.0,
		decay: 0.6,
		sustain: 0.0,
		release: 0.9
	},
}).toMaster();
polyOscSynth.filter.frequency.value = 20000;
polyOscSynth.filter.Q.value = 1;
polyOscSynth.osc0 = polyOscSynth.oscillator;
polyOscSynth.osc0.detune.value = -50;
polyOscSynth.osc0.chain(polyOscSynth.filter, polyOscSynth.envelope, polyOscSynth.output);
polyOscSynth.osc0.start();
polyOscSynth.osc1 = new Tone.OmniOscillator(440, "sawtooth");
polyOscSynth.osc1.detune.value = 50;
polyOscSynth.osc1.chain(polyOscSynth.filter, polyOscSynth.envelope, polyOscSynth.output);
polyOscSynth.osc1.start();
polyOscSynth.oscillator = null;


keyboard.addEventListener("mousedown", function(e) {
	if (e.target.nodeName === "BUTTON") {
		polyOscSynth.triggerAttack(e.target.dataset.note);
	}
});
keyboard.addEventListener("mouseup", function(e) {
	polyOscSynth.triggerRelease();
})


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

