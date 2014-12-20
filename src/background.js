
chrome.webRequest.onBeforeRequest.addListener(function(details) {
        var scheme = /^https/.test(details.url) ? 'https' : 'http';
        var blocked_url = chrome.extension.getURL("blocked.html");
        console.log( betty_blocker.get_twitter_user_(details.url));
        // return {redirectUrl: blocked_url};
	}, {
        urls: ['*://twitter.com/*'] // Example: Block all requests to YouTube
	}, ['blocking']);

var user_list = [];

var betty_blocker = {
	
  	block_user: function() {
		chrome.tabs.query({ currentWindow: true, active: true }, this.block_user_(tabs) );
	},

	block_user_: function(tabs) {
		if(typeof tabs[0] !== 'undefined') {
			var user_name = this.get_twitter_user_(tabs[0].url);
			console.log(user_name);
		}
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


chrome.runtime.onMessage.addListener(
    function(request,sender,sendResponse) {
        if(request.type == "betty_block_user_now") {
            betty_blocker.block_user();
        }
    }
);
