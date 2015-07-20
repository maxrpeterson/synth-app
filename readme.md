# General Assembly - WDI Melville - Final Project

## What is it?
A three-oscillator synthesizer you can play with your keyboard. The keys in the "asdf..." row control the white keys, and the black keys are in the "qwer..." row. To control the knobs, click and drag your mouse &uarr; and &darr;. Press "x" to change the range of the keyboard up one octave, and "z" to go down one.

I created this project for my final project for General Assembly's Web Development Immersive class. I used [Tone.js](https://github.com/Tonejs/Tone.js) to help simplify the synth code, and [Qwerty Hancock](https://github.com/stuartmemo/qwerty-hancock) for the keyboard. There is an Express.js server on the back end, which saves presets to a MongoDB collection.

For the guts of the synth, I created a new Tone.Instrument class to be able to use Tone.js's PolySynth class, which creates multiple copies of a voice to enable polyphony (playing more than one note at a time). It also uses Facebook log in to save settings to a MongoDB database.

For the moment, this only works in Chrome, sorry!

### Check it out:
[synth.maxpeterson.nyc](http://synth.maxpeterson.nyc)

------
### Some Background
I have always had an interest in music production, and thought it would be cool to try and make something for it on the web. My project would be a little bit of a sandbox, in that you can create your own synth patches. It would also be great to have a way to save patches you make using some sort of database. Some reach goals would be a sequencer for notes, and sharing patches among friends.

