var checkLogin = function() {
	FB.getLoginStatus(function(response) {
		statusChangeCallback(response);
	});
};

var statusChangeCallback = function(response) {
	if (response.status === "connected") {
		enableSaving();

	} else {
		console.log(response);
	}
};

var enableSaving = function() {
	
};