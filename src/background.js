
// this is our blocker object
// TODO: need to get jquery in here and also learn
// more about how this should work as it seems slow right now
var betty_blocker = {
	
	// our fuction to process a click of the "block user now" button
   	block_user: function() {
   		// find the currently open tab in the browser window
   		// need to figure this out for safari
		chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
			if(typeof tabs !== 'undefined' && typeof tabs[0] !== 'undefined') {
				// need to figure out how to call self within an anonymous call
				// thse are inefficient
				var user_name = betty_blocker.get_twitter_user_(tabs[0].url);
				var user_list = betty_blocker.load_users();
				user_list.push(user_name);
				betty_blocker.save_users(user_list);
			}
		});
	},

	save_users: function(user_list) {
		var names = [];
		localStorage["betty_blocker_user_list"] = JSON.stringify(user_list);
	},

	load_users: function() {
		user_list = JSON.parse(localStorage["betty_blocker_user_list"] || null);
		if(user_list == null) user_list = [];
		return user_list;
	},

	get_twitter_user_: function(url) {
		var user_name = false;
 		var parsed_url = this.parseURL_(url);
		if(parsed_url.hostname == "twitter.com") {
			var temp = parsed_url.pathname.split('/');
			if(typeof temp[1] !== 'undefined') {
				user_name = temp[1];
			}
		}
		return user_name;
	},

	parseURL_: function(url) {
		var parser = document.createElement('a'),
			searchObject = {},
			queries, split, i;
		// Let the browser do the work
		parser.href = url;
		// Convert query string to object
		queries = parser.search.replace(/^\?/, '').split('&');
		for( i = 0; i < queries.length; i++ ) {
			split = queries[i].split('=');
			searchObject[split[0]] = split[1];
		}
		return {
			protocol: parser.protocol,
			host: parser.host,
			hostname: parser.hostname,
			port: parser.port,
			pathname: parser.pathname,
			search: parser.search,
			searchObject: searchObject,
			hash: parser.hash
		};
	}
};


// Add a listener to the webrequest process that parses the URL BEFORE
// the browser navigates to the page
chrome.webRequest.onBeforeRequest.addListener(function(details) {
	// Attempt to extract the Twitter Username from the URL
	var user_name = betty_blocker.get_twitter_user_(details.url);
	// if a username was found then
	if(user_name !== false) {
		// load up the stored user list (this should be moved into the better_blocker object?)
		var user_list = betty_blocker.load_users();
		// find the username in the list of stored users
		if(user_list.indexOf(user_name) > -1 ) {
			// if the username was found, then send the browser to our internal
			// blocked user page
			return {redirectUrl: chrome.extension.getURL("blocked.html") + "?user=" + user_name};
		}
	}
}, {
	// we're currently only interested in twitter URLS
	urls: ['*://twitter.com/*']
}, ['blocking']);

// Add a listener for the message from the popup.html that the
// user clicks to block a currently browsed user
chrome.runtime.onMessage.addListener(
	// anonymouse function to recieve the listener message
    function(request, sender, sendResponse) {
    	// if the type of message is what we're interested in
        if(request.type == "betty_block_user_now") {
        	// call the block_user portion of the script
            betty_blocker.block_user();
        }
    }
);
