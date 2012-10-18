var OAuth = require('oauth').OAuth;
var util = require('util');
var url = require('url');
var arrayUtils = require('./arrayUtils');
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
var userToken = '8b59736d-576a-43ce-b81a-dea50c43f1cb';
var userSecret = '6858d22b-c871-4b1d-8c81-7200acc3251b';
var oauthCallback = '/linkedin/oauth_callback';
var peopleFetchUrl = 'http://api.linkedin.com/v1/people/~';

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
}

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
				console.log(data);
			});
};

exports.getLinkedInHandler = function(redirectUrl) {
	return function(req, res) {
		var urlParts = url.parse(req.url, true);
		
		console.log("$$$$$$");
		console.log(urlParts);
		
		req.session.userId = 'apple';
		
		req.linkedInToken.oauthVerifier = urlParts.query.oauth_verifier;
		
		res.redirect(redirectUrl);
	};
};



/*
 * { oauth_callback_confirmed: 'true',
  xoauth_request_auth_url: 'https://api.linkedin.com/uas/oauth/authorize',
  oauth_expires_in: '599' }
 */

