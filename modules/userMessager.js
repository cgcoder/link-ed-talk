/*
 * user messager - send message/receive from users.
 * 
 *  this module is responsible for all network related messages.
 */

/*
 this.socket = _socket;
    this.socket.on('connect-ok', this.handleConnectionOk);
    this.socket.on('refresh-friend-list-reply', this.handleRefreshFriendList);
    this.socket.on('friend-online', this.handleFriendOnline);
    this.socket.on('friend-offline', this.handleFriendOffline);
    this.socket.on('disconnect', this.handleDisconnect);
 */

arrayUtils = require('./arrayUtils');

exports.userMessager = (function(_userStateProvider, _friendProvider)
{
  return {
    userStateProvider: _userStateProvider
	, friendProvider: _friendProvider
	
	, initMessager: function(userId) {
		var user = this.userStateProvider.getUser(userId);
	
		if (!user) {
			console.log('userMessage.initMessager cannot find user ' + userId);
		}
		else {
			var socket = user.socket;
			var me = this;
			socket.on('update-friend-list', function() { me.sendUpdatedFriendList(user.userId, socket); });
			socket.on('refresh-friend-list', function() { me.sendFriendList(user.userId, socket); });
			socket.on('send-message', function(message) { me.sendMessage(user.userId, socket, message); });
			socket.on('disconnect', function(data) { me.handleDisconnect(user.userId, data); });
		}
	}
  
  	, sendConnectionOk: function(userId) {
  		var user = this.userStateProvider.getUser(userId);
  		if (user && user.socket) {
  			user.socket.emit('connection-ok');
  		}
  		else {
  			console.log('error: user state not found for ' + userId);
  		}
  	}
  	
  	, sendFriendListReady: function(userId) {
  		var user = this.userStateProvider.getUser(userId);
  		if (user && user.socket) {
  			user.socket.emit('friend-list-ready');
  		}
  		else {
  			console.log('error: user state not found for ' + userId);
  		}
  	}
  
	, sendFriendList: function(userId, socket) {
		console.log('sendFriendList for ' + userId);
		
		if (userStateProvider.checkUserOnline(userId)) {
			friendList = friendProvider.listFriends(userId);
			
			if (friendList) {
			
				arrayUtils.onEach(friendList, function(user) {
					user.online = userStateProvider.checkUserOnline(user.userId);
				});
				
				socket.emit('refresh-friend-list-reply', friendList);
			}
			else {
				socket.emit('friend-list-not-available');
			}
		}
      }
	
	, onNewOnlineUser: function(userId) {
		var friendList = this.friendProvider.listFriends(userId);
		var onlineUser = this.userStateProvider.getUser(userId);

		/*var me = this;
		
		arrayUtils.forEach(friendList, function(friendUser) {
			if(me.userStateProvider.checkUserOnline(friendUser.userId)) {
				console.log("------->" + onlineUser.encryptedUserId);
				var friendState = me.userStateProvider.getUser(friendUser.userId);
				me.sendFriendOnline(onlineUser.encryptedUserId, 
						friendUser.userId, friendState.socket);
			}
		});
		*/
	}
	
	, sendFriendOnline: function(newencryptedUserId, userId, socket) {
		socket.emit('friend-online', newencryptedUserId);
	}
	
	, sendFriendOffline: function(newencryptedUserId, userId, socket) {
		socket.emit('friend-offline', newencryptedUserId);
	}
	
	, sendMessage: function(userId, socket, message) {
		frm = userId;
		to = message.to;
		str = message.payload;
		
		socket.emit('send-message', message);
				
		if (this.userStateProvider.checkUserOnline(to)) {
			sendMessage = {};
			sendMessage.from = userId;
			sendMessage.payload = str;
			
			toSocket = this.userStateProvider.getUser(to).socket;
			toSocket.emit('receive-message', sendMessage);
		}
		else {
			console.log("user offline >>>>> sendmessage " + "From: " + userId + " To: " + message.to + " Msg: " + message.payload);
		}
	}
	
	, handleDisconnect: function(userId, data) {
		this.userStateProvider.userIsOffline(userId);
		
		console.log('disconnecting ... ' + userId);
	}
  };
});
