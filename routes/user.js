url = require('url');
util = require('util');
OAuth = require('oauth').OAuth;
linkedIn = require('./../modules/linkedin');
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};


/*
 * GET login page.
 */

exports.login = function(req, res){

  query = url.parse(req.url).query;

  if(query && query.page)
  {
    res.render('login', {error: true, err_msg: '',title: 'test' });
  }
  else
  {
    res.render('login', {error: false, title: 'test'});
  }
};

exports.doLogin = function(req, res) {
  query = url.parse(req.url).query;

  if (req.body.username)
  {
    console.log('login request for : ' + req.body.username);
    uname = req.body.username;

    if (uname == 'apple' || uname == 'boy' || uname == 'cat')
    {
      console.log('valid user found...'); 
      req.session.userId = uname;
      res.redirect('/secure/user/home');
    }
    else
    {
      res.redirect('/login');
      console.log('invalid users..');
    }
  }
};

exports.doLinkedInLogin = function(req, res) {
	
	// defined in linkedin.js
	callbackUrl = 'http://localhost:3001/linkedin/oauth_callback';
	
	scopeArray = new Array();
	scopeArray[0] = 'r_basicprofile';
	scopeArray[1] = 'r_network';
	
	linkedIn.fetchOAuthRequestToken(function(isError, obj) {
		if (isError) {
			console.log('Error fetch request token: ' + obj);
		}
		else {
			token = obj;
			req.session.linkedInTokenId = token.oauthToken;
			userStateProvider.setUserToken(req.session.linkedInTokenId, token);
			
			res.redirect(token.getAuthorizeUrl());
		}
	}, callbackUrl, scopeArray);
};

exports.updateProfile = function(req, res) {
	
	if (req.linkedInToken) {
		console.log('linkedin token found!');
		linkedIn.validateToken(req.linkedInToken);
		
		
		linkedIn.fetchOAuthAccessToken(function(error, oauth_access_token, oauth_access_token_secret, results ) {
			
			if (error) {
				console.log('error fetching access token');
			}
			else {
				req.linkedInToken.oauthAccessToken = oauth_access_token;
				req.linkedInToken.oauthAccessTokenSecret = oauth_access_token_secret;
				console.log('fetch access token ok!');
				console.log(util.inspect(results));
			}
			
			linkedIn.fetchBasicProfile(
					function(error, data) {
						if (!error) {
							user = eval('(' + data + ')');
							userId = req.userStateProvider.generateUserId(user);
							req.userStateProvider.setUserIdToken(userId, req.linkedInToken);
							req.userStateProvider.setUser(userId, user);
							req.session.userId = userId;
							
							res.redirect('http://localhost:3001' + '/secure/user/home');
						}
					}, 
					req.linkedInToken);
		}, req.linkedInToken);
	}
	else {
		console.log('linkedin token not found!');
		res.redirect('http://localhost:3001' + '/logout');
		return;
	}
};

exports.home = function(req, res) {
	
  if(req.session.linkedInToken) {
	  if (req.session.linkedInToken.oauthVerifier) {
		  verifier = req.session.linkedInToken.oauthVerifier;
	  }
  }
  
  user = req.userStateProvider.getUser(req.session.userId);

  model = {
		  error: false, 
		  firstName: user["firstName"],
		  lastName: user["lastName"],
		  headline: user["headline"],
		  pictureUrl: user["pictureUrl"],
		  title: user.firstName + '\'s Home'};

  res.render('home', model);
};

exports.logout = function(req, res) {
  req.session.uname = null;
  if (req.session.linkedInTokenId) {
	  userStateProvider.setUserToken(req.session.linkedInTokenId);
  }
  req.session = null;
  res.redirect('/login');
};
