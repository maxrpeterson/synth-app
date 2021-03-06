function Module(func){
	func(Tone);
};
Module(function (Tone) {
	// this class takes liberally from Tone.js's built in classes
  Tone.PolyOsc = function (options) {
    options = this.defaultArg(options, Tone.PolyOsc.defaults);
    Tone.Monophonic.call(this, options);
    // 1st osc
    this.osc0 = new Tone.OmniOscillator(options.osc0);
    this.osc0.volume.value = -10;
    // 2nd osc
    this.osc1 = new Tone.OmniOscillator(options.osc1);
    this.osc1.volume.value = -10;
    // 3rd osc
    this.osc2 = new Tone.OmniOscillator(options.osc2);
    this.osc2.volume.value = -10;

    this.frequency = new Tone.Signal(440, Tone.Type.Frequency);

    //control the three oscillators frequency
    this.frequency.fan(this.osc0.frequency, this.osc1.frequency, this.osc2.frequency);

    // filter
    this.filter = new Tone.Filter(options.filter);
    this.filterEnvelope = new Tone.ScaledEnvelope(options.filterEnvelope);
    this.filterEnvelope.connect(this.filter.frequency);

    this.envelope = new Tone.AmplitudeEnvelope(options.envelope);

    this.osc0.connect(this.filter);
    this.osc1.connect(this.filter);
    this.osc2.connect(this.filter);

    this.osc0.start();
    this.osc1.start();
    this.osc2.start();

    this.filter.chain(this.envelope, this.output);

    this._readOnly([
        'osc0',
        'osc1',
        'osc2',
        'filter',
        'frequency'
    ]);
  };
  Tone.extend(Tone.PolyOsc, Tone.Monophonic);


  Tone.PolyOsc.defaults = {
    'portamento': 0,
    'osc0': { 'type': 'sine', 'volume': 0 },
    'osc1': { 'type': 'sine', 'volume': -99 },
    'osc2': { 'type': 'sine', 'volume': -99 },
		'filter': {
      'Q': 6,
      'type': 'lowpass',
      'frequency': 20000,
      'rolloff': -12
    },
    'filterEnvelope': {
      'attack': 0.01,
      'decay': 0.5,
      'sustain': 0,
      'release': 1,
      'max': 4000,
      'exponent': 2,
      'attackCurve': 'linear'
    },
    'envelope': {
      'attack': 0.01,
      'decay': 0,
      'sustain': 1,
      'release': 0.5
    }
  };
    /**
	 *  start the attack portion of the envelopes
	 *  
	 *  @param {Time} [time=now] the time the attack should start
	 *  @param {NormalRange} [velocity=1] the velocity of the note (0-1)
	 *  @returns {Tone.DuoSynth} this
	 *  @private
	 */
    Tone.PolyOsc.prototype._triggerEnvelopeAttack = function (time, velocity) {
        time = this.toSeconds(time);
        this.envelope.triggerAttack(time, velocity);
        this.filterEnvelope.triggerAttack(time);
        return this;
    };
    /**
	 *  start the release portion of the envelopes
	 *  
	 *  @param {Time} [time=now] the time the release should start
	 *  @returns {Tone.DuoSynth} this
	 *  @private
	 */
    Tone.PolyOsc.prototype._triggerEnvelopeRelease = function (time) {
        this.envelope.triggerRelease(time);
        this.filterEnvelope.triggerRelease();
        return this;
    };
    /**
	 *  clean up
	 *  @returns {Tone.DuoSynth} this
	 */
	Tone.PolyOsc.prototype.dispose = function () {
    Tone.Monophonic.prototype.dispose.call(this);
    this._writable([
      'osc0',
      'osc1',
      'osc2',
      'frequency',
    ]);
    this.osc0.dispose();
    this.osc0 = null;
    this.osc1.dispose();
    this.osc1 = null;
    this.osc2.dispose();
    this.osc2 = null;
    this.frequency.dispose();
    this.frequency = null;
    return this;
  };
  return Tone.DuoSynth;
});