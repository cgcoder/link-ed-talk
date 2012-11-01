var OAuth = require('oauth').OAuth;
var util = require('util');
var url = require('url');
var arrayUtils = require('./arrayUtils');
var myUtils = require('./utils');
var deferrer = require('./deferred').deferrer;

// requesturl, accessurl, consumerkey, consumersecret, version
/*
 * configuration = { :site => 'https://api.linkedin.com',
                          :authorize_path => '/uas/oauth/authenticate',
                          :request_token_path => '/uas/oauth/requestToken',
                          :access_token_path => '/uas/oauth/accessToken' }
 */
//https://api.linkedin.com/uas/oauth/requestToken?scope=r_basicprofile+r_emailaddress
var requestUrl = 'https://api.linkedin.com/uas/oauth/requestToken';
var accessUrl = 'https://api.linkedin.com/uas/oauth/accessToken';

var apiKey = '9gpzg4ik7zoa';
var secretKey = 'ju0o2AEuTgyD4Pgp';
var userToken = '98591b9a-229b-4bef-9b44-42370a68980b';
var userSecret = 'ee272150-d3b8-4895-b6cb-1c1f314a6700';
var oauthCallback = '/linkedin/oauth_callback';
var peopleFetchUrl = 'http://api.linkedin.com/v1/people/~:(first-name,last-name,headline,picture-url)?format=json';
var connectionFetchUrl = 'http://api.linkedin.com/v1/people/~/connections:(first-name,last-name,headline,picture-url)?format=json';

exports.requestUrl = requestUrl;
exports.accessUrl = accessUrl;
exports.apiKey = apiKey;
exports.secretKey = secretKey;

exports.userToken = userToken;
exports.userSecret = userSecret;

exports.oauthCallback = oauthCallback;
exports.peopleFetchUrl = peopleFetchUrl;

Token = function(oa, oauth_token, oauth_token_secret, extra) {
	this.oa = oa; // oauth instance of this token
	this.oauthToken = oauth_token;
	this.oauthTokenSecret = oauth_token_secret;
	this.extra = extra;
	
	this.getAuthorizeUrl = function() {
		return this.extra.xoauth_request_auth_url + '?oauth_token=' + this.oauthToken;
	};
};

_validateToken = function(token) {
	if (token.oauthToken == undefined || 
			token.oauthTokenSecret == undefined || 
			token.extra == undefined || 
			token.oa == undefined) {
		throw "Invalid token object";
	}
};

exports.validateToken = _validateToken;

exports.Token = Token;

exports.fetchOAuthRequestToken = function(callback, callbackUrl, scopeArray) {
	
	var scope = 'scope=';
	
	arrayUtils.onEach(scopeArray, function(item, last) {
		if (last == false) {
			scope = scope + item + '+';
		}
		else {
			scope = scope + item;
		}
	});
	
	actualUrl = requestUrl + '?' + scope;
	//console.log(actualUrl);
	
	var oa = new OAuth(actualUrl, accessUrl, apiKey, secretKey, 
			'1.0', callbackUrl, 'HMAC-SHA1');
	
	//console.log(oa.getProtectedResource);
	oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
		if (error) {
			callback(true, error);
		}
		else {
			callback(false, new Token(oa, oauth_token, oauth_token_secret, results));
		}
	});
};

exports.fetchOAuthAccessToken = function(callback, token) {
	_validateToken(token);
	console.log(util.inspect(token));
	console.log("token callback confirmed: " + token.extra.oauth_callback_confirmed);
	
	token.oa.getOAuthAccessToken(token.oauthToken, token.oauthTokenSecret, token.oauthVerifier, callback);
	
};

exports.fetchBasicProfile = function(callback, token) {
	
	console.log('fetchBasicProfile: ', token.oauthToken, token.oauthTokenSecret);
	
	token.oa.getProtectedResource(linkedIn.peopleFetchUrl, "GET", 
			token.oauthAccessToken, token.oauthAccessTokenSecret,
			function(error, data) {
				callback(error, data);
			});
};

exports.fetchConnections = function(callback, userId, token) {
	_validateToken(token);
	
	if (!callback || !userId) {
		throw "Invalid args for fetch connections.";
	}
	
	fd = deferrer.newDeferred(function(_d, start, count, friendArray) {
		updatedUrl = connectionFetchUrl + '&start=' + start + '&count=' + count;

		token.oa.getProtectedResource(updatedUrl, "GET", 
				token.oauthAccessToken, token.oauthAccessTokenSecret,
				function(error, data) {
					if (error) {
						_d.reject(error, data);
					}
					else {
						dataObj = eval('(' + data +')');
						
						// when connections is < page size, we get only total
						if (dataObj._count == undefined) {
							count = dataObj._total;
							start = start + dataObj._total;
						}
						else {
							count = dataObj._count;
							start = start + dataObj._count;
						}
						
						for(i = 0; i < dataObj.values.length; i++) {
							if (dataObj.values[i].firstName && 
									dataObj.values[i].firstName != 'private') {
								friendArray.push(dataObj.values[i]);
							}
						}
						
						if (start >= dataObj["_total"]) { // completed
							_d.accept(friendArray);
						}
						else { // continue
						    _d.again(start, count, friendArray);
						}
					}
				});
	}, 
	function(_d, err, data) {
	    // handle failure
		callback(err, data);
	}).chain(function(_d, friendArray) {
		// handle success!
	    callback(null, friendArray);
	});
	
	fd.start(0, 20, new Array());
};

exports.getLinkedInHandler = function(redirectUrl) {
	return function(req, res) {
		var urlParts = url.parse(req.url, true);
		req.linkedInToken.oauthVerifier = urlParts.query.oauth_verifier;
		res.redirect(redirectUrl);
	};
};



/*
 * { oauth_callback_confirmed: 'true',
  xoauth_request_auth_url: 'https://api.linkedin.com/uas/oauth/authorize',
  oauth_expires_in: '599' }
 */

