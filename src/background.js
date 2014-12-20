
chrome.webRequest.onBeforeRequest.addListener(function(details) {
        var returner = false;
        var scheme = /^https/.test(details.url) ? 'https' : 'http';
        var blocked_url = chrome.extension.getURL("blocked.html");
        var user_name = betty_blocker.get_twitter_user_(details.url);
        if(user_name !== false) {
	        var user_list = betty_blocker.load_users();
        	if(user_list.indexOf(user_name) > -1 ) {
        		returner = {redirectUrl: blocked_url};
        	}
        }
        if(returner) return returner;
  	}, {
        urls: ['*://twitter.com/*']
	}, ['blocking']);


var betty_blocker = {
	
   	block_user: function() {
		chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
			if(typeof tabs !== 'undefined' && typeof tabs[0] !== 'undefined') {
				var user_name = betty_blocker.get_twitter_user_(tabs[0].url);
				var user_list = betty_blocker.load_users();
				user_list.push(user_name);
				betty_blocker.save_users(user_list);
				console.log(user_name);
				console.log(user_list);
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


chrome.runtime.onMessage.addListener(
    function(request,sender,sendResponse) {
        if(request.type == "betty_block_user_now") {
            betty_blocker.block_user();
        }
    }
);
