/*
 * Security provider
 */

url = require('url')

exports.sessionChecker = (function(data) {
	return function(req, res, next) {
		console.log(req.url.indexOf("secure"));

		req_path = url.parse(req.url).pathname;

		if (req_path.indexOf("secure") == -1
				|| (req.session && req.session.userId)
				|| (req.session.linkedInTokenId)) {
			if (req.session.linkedInTokenId) {
				req.linkedInToken = userStateProvider
						.getUserToken(req.session.linkedInTokenId);
			}
			next();
		} else {
			console.log("login required. redirecting to login page.");
			res.redirect('/login?page=' + encodeURIComponent(req.url));
		}
	};
});
