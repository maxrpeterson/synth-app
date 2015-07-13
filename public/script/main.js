var uiKeyboard = document.querySelector("#keyboard");

var hwKeyboard = {};
window.addEventListener("keydown", function(e) {
	console.log(e);
});



uiKeyboard.addEventListener("mousedown", function(e) {
	if (e.target.tagName === "BUTTON") {
		console.log(e.target.dataset.note);
		duoSynth.triggerAttack(e.target.dataset.note);
	}
	console.log(e.target.tagName);
});
uiKeyboard.addEventListener("mouseup", function(e) {
	duoSynth.triggerRelease();
});

