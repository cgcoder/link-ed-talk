/**
 * Module dependencies.
 */

var express = require('express')
	, routes = require('./routes')
	, user = require('./routes/user')
	, MemoryStore = express.session.MemoryStore
	, http = require('http')
	, path = require('path')
	, cacheModule = require('./modules/cache')
	, friendProviderModule = require('./modules/friendProvider')
	, securityProvider = require('./modules/securityProvider.js')
	, userStateProviderModule = require('./modules/userStateProvider.js')
	, userMessagerModule = require('./modules/userMessager.js')
	, linkedInModule = require('./modules/linkedin.js')
	, siom = require('socket.io')
	, connectUtils = require('connect').utils
	, cookie = require('cookie')
	, utils = require('./modules/utils');

var serverHostname = 'localhost';
var serverPort = '3001';
var serverWebRoot = serverHostname + ':' + serverPort;
var serverProtocol = 'http';
var serverWebRootUrl = serverProtocol + '//' + serverWebRoot;

var app = express();
sessionstore = new MemoryStore();

app.configure(function() {
	app.set('port', 3001);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	//app.use(express.cookieParser('Z3xncAOjkx#!7@#Mvdn'));
	app.use(express.cookieParser('password'));
	app.use(express.session({
		key : 'express.sid',
		store : sessionstore,
		secret : 'password'
	}));
	app.use(securityProvider.sessionChecker());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
	app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/login', user.login);
app.get('/logout', user.logout);
app.post('/login.do', user.doLogin);
app.post('/linkedInLogin.do', user.doLinkedInLogin);
app.get(linkedInModule.oauthCallback, linkedInModule.getLinkedInHandler('/secure/user/updateProfile'));
app.get('/secure/user/home', user.home);
app.get('/secure/user/updateProfile', user.updateProfile)

datacache = cacheModule.cache.newCache();
friendProvider = friendProviderModule.friendProvider;

// responsible for maintain the user states..
userStateProvider = userStateProviderModule.userStateProvider;

//handles all io communications..
userMessager = userMessagerModule.userMessager(userStateProvider, friendProvider);

server = http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));
});
var sio = siom.listen(server);

sio.set('authorization', function(data, accept) {
	console.log('authorization');
	
	if (data.headers.cookie) {
		
		data.cookie = cookie.parse(data.headers.cookie);
		data.sessionID = connectUtils.parseSignedCookie(data.cookie['express.sid'], 'password');
			
		sessionstore.load(data.sessionID, function(err, session) {
			if (err || !session) {
				accept('Error', false);
			} else {
				data.session = session;
				accept(null, true);
			}
		});
	} else {
		return accept('No cookie transmitted.', false);
	}
	// accept the incoming connection
	accept(null, true);
});

sio.sockets.on('connection', function(socket) {
	
	if ( socket.handshake.session && socket.handshake.session.userId) {
		var userId = socket.handshake.session.userId;
		userStateProvider.userIsOnline(userId, socket);
		userMessager.initMessager(userId);
		userMessager.sendConnectionOk(userId);
		userMessager.onNewOnlineUser(userId);
	}
});