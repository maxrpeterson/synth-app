# General Assembly - WDI Melville - Final Project

## What is it?
A web-based synthesizer featuring 3 oscillators and some effects. It was built using [Tone.js](https://github.com/TONEnoTONE/Tone.js) and [Qwerty Hancock](https://github.com/stuartmemo/qwerty-hancock).

For the guts of the synth, I created a new Tone.Instrument class to be able to use Tone.js's PolySynth class, which creates multiple copies of a voice to enable polyphony (playing more than one note at a time). It also uses Facebook log in to save settings to a MongoDB database.

This is pretty much only gonna work in Chrome, so you've been warned if you try to open it in any other browser. Hopefully I can get around to updating it to work in more browsers soon.

------
### Some Background
I have always had an interest in music production, and thought it would be cool to try and make something for it on the web. My project would be a little bit of a sandbox, in that you can create your own synth patches. It would also be great to have a way to save patches you make using some sort of database. Some reach goals would be a sequencer for notes, and sharing patches among friends.

