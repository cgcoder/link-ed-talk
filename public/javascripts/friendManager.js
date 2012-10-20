function beginChat(userId) {
	friendManager.beginChat(userId);
}

function FriendManager(_dialogManager) {
	this.friends = {};
	this.dialogs = {};
	this.dialogsReverse = {};
	this.dialogManager = _dialogManager;
	this.dialogManager.friendManager = this;

	this.initSocket = function(_socket) {
		this.socket = _socket;
		me = this;

		this.socket.on('connection-ok', function(data) {
			me.handleConnectionOk(data);
		});
		this.socket.on('friend-list-ready', function(data) {
			me.handleFriendListReady(data);
		});
		this.socket.on('refresh-friend-list-reply', function(data) {
			me.handleRefreshFriendList(data);
		});
		this.socket.on('friend-online', function(data) {
			me.handleFriendOnline(data);
		});
		this.socket.on('friend-offline', function(data) {
			me.handleFriendOffline(data);
		});
		this.socket.on('send-message', function(data) {
			me.handleSendMessage(data);
		});
		this.socket.on('receive-message', function(data) {
			me.handleMessageReceive(data);
		});
		this.socket.on('disconnect', function(data) {
			me.handleDisconnect(data);
		});
	};

	this.getLoggedInUser = function() {
		return $("#userId").val();
	}
	
	this.handleConnectionOk = function(_data) {
		//this.refreshFriendList(_data);
	};

	this.refreshFriendList = function(_data) {
		this.socket.emit('refresh-friend-list');
	};

	this.handleFriendListReady = function(_data) {
		this.refreshFriendList(_data);
	};
	
	this.handleRefreshFriendList = function(_friendList) {
		for ( var i = 0; i < _friendList.length; i++) {
			$('#friendList').append(
					this.getFriendItemHtml('test', _friendList[i]));
			this.friends[_friendList[i].encryptedUserId] = _friendList[i];
		}
	};

	this.getFriendItemHtml = function(id, user) {
		return "<li id='friend_outer_" + user.encryptedUserId
				+ "' class='friendListItem'>"
				+ this.getFriendItemInnerHtml(id, user) + "</li>";
	};

	this.getFriendItemInnerHtml = function(id, user) {

		if (user.online) {
			statusImg = '/images/online.png';
		} else {
			statusImg = '/images/offline.png';
		}

		str = "<table style='width: 100%'><tr>" + "<td width='80%'>"
				+ user.encryptedUserId + "</td>"
				+ "<td><button type='button' id='button_"
				+ user.encryptedUserId + "' onclick=\"javascript: beginChat('"
				+ user.encryptedUserId + "')\">Chat</button></td>"
				+ "<td width='20%'>" + "<img id='img_status_"
				+ user.encryptedUserId + "' src='" + statusImg + "' />"
				+ "</td>"
		"</tr></table>";

		return str;
	};

	this.handleFriendOnline = function(_friendOnlineUserId) {
		this.friends[_friendOnlineUserId].online = true;
		statusImg = '/images/online.png';
		$('#img_status_' + _friendOnlineUserId).attr('src', statusImg);
	};

	this.handleFriendOffline = function(_friendOfflineUserId) {
		_friendList[_friendOfflineUserId].online = false;
	};

	this.sendMessage = function(encryptedUserId, _message) {
		message = {
			'to' : encryptedUserId,
			'payload' : _message
		};
		this.socket.emit('send-message', message);
	};

	this.handleSendMessage = function(_message) {
		dialogId = this.dialogs[_message.to];
		this.dialogManager.addMessage(dialogId, this.getLoggedInUser() + ": " + _message.payload);
	};

	this.handleMessageReceive = function(_message) {
		this.beginChat(_message.from);
		dialogId = this.dialogs[_message.from];
		this.dialogManager.addMessage(dialogId, _message.from + ": " + _message.payload);
	};

	this.beginChat = function(userId) {
		if (this.dialogs[userId]) {
		} else {
			dialogId = this.dialogManager.newDialog(this.dialogListener);
			this.dialogs[userId] = dialogId;
			this.dialogsReverse[dialogId] = userId;
		}
	};

	this.dialogListener = function(event, dialogId) {
		if (event == 'send-message') {
			this.onSendMessage(dialogId);
		}
	};

	this.onSendMessage = function(dialogId) {
		toUserId = this.dialogsReverse[dialogId];

		if (toUserId) {
			msgStr = this.dialogManager.getInputText(dialogId);
			this.sendMessage(toUserId, msgStr);
		} else {
			alert("Can't find UI for user " + toUserId);
		}
	}

	this.setEnableChatButton = function(userId, enabled) {
	};

	this.handleDisconnect = function(_message) {
		// TODO: any other clean up here?
		this.socket = null;
	};

	this.disconnect = function() {
		// TODO: any other clean up here?
		this.socket = null;
	};
};