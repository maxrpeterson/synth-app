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

// WAT

// polyOscSynth.oscillator.dispose();
// polyOscSynth.frequency = polyOscSynth.osc0.frequency;
// polyOscSynth.frequency1 = polyOscSynth.osc1.frequency;
// polyOscSynth.setNote = function (note, time) {
//   time = polyOscSynth.toSeconds(time);
//   if (polyOscSynth.portamento > 0) {
//       var currentNote = polyOscSynth.frequency.value;
//       polyOscSynth.frequency.setValueAtTime(currentNote, time);
//       polyOscSynth.frequency1.setValueAtTime(currentNote, time);
//       var portTime = polyOscSynth.toSeconds(polyOscSynth.portamento);
//       polyOscSynth.frequency.exponentialRampToValueAtTime(note, time + portTime);
//       polyOscSynth.frequency1.exponentialRampToValueAtTime(note, time + portTime);
//   } else {
//       polyOscSynth.frequency.setValueAtTime(note, time);
//       polyOscSynth.frequency1.setValueAtTime(note, time);
//   }
//   return polyOscSynth;
// };


keyboard.addEventListener("mousedown", function(e) {
	if (e.target.nodeName === "BUTTON") {
		polyOscSynth.triggerAttack(e.target.dataset.note);
	}
});
keyboard.addEventListener("mouseup", function(e) {
	polyOscSynth.triggerRelease();
})

