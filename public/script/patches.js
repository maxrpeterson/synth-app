var checkLogin = function() {
	FB.getLoginStatus(function(response) {
		statusChangeCallback(response);
	});
};

var userId;

var statusChangeCallback = function(response) {
	if (response.status === "connected") {
		enableSaving();
		userId = response.authResponse.userID;
	} else {
		console.log(response);
	}
};

var enableSaving = function() {
	document.querySelector(".save-load").innerHTML = '<a href="#" id="save">Save Patch</a><a href="#" id="load">Load Patch</a>';
	document.querySelector(".save-load").addEventListener("click", function(e) {
		e.preventDefault();
		if (e.target.id === "save") {
			savePatch();
		} else if (e.target.id === "load") {
			loadPatch();
		}
	});
};

var savePatch = function() {
	var settings = polyOsc.get();
	
};