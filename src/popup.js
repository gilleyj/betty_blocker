
// add a listener to the popup html file (this is called from that)
// that listens to the button click
// NOTE: Need to figure out how to add jquery to this codebase
document.addEventListener('DOMContentLoaded', function () {
	// find the button by ID
	var myEl = document.getElementById('betty_block_block_button');
	// add a listener to that button we found
	myEl.addEventListener('click', function() {
		// send a remote message to the backend.js to block a user we are browsed too
		chrome.runtime.sendMessage({type: "betty_block_user_now"});
	}, false);
});

