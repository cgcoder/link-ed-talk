/*
  Friend list provider
 */

apple = {
	userId : "apple",
};

boy = {
	userId : "boy",
};

cat = {
	userId : "cat",
};

exports.friendProvider = function(appln) {
    this.app = appln;
    
    this.fetchStatus = {};
    
    this.friendList = {};
    
    this.updateFetchStatus = function(userId, status) {
    	this.fetchStatus[userId] = status;
    };
     
    this.getFetchStatus = function(userId) {
    	return this.fetchStatus[userId];
    };
    
     this.listFriends = function(userId) {
    	 
    	if (!this.fetchStatus[userId]) {
    		return null;
    	}
    	
    	return this.friendList[userId];
    };
    
    this.refreshFriends = function(callback, userId) {
    	this.updateFetchStatus(userId, false);
    	
    	var token = this.app.context.userStateProvider.getUserIdToken(userId);
    	var me = this;
    	
    	this.app.context.linkedIn.fetchConnections(
    			function(error, data) {
    				if (!error) {
    					// data is list of user object returned by linekdin api
    					for(i = 0; i < data.length; i++) {
    						data[i].userId = me.app.context.userStateProvider.generateUserId(data[i]);
    						data[i].encryptedUserId = me.app.context.userStateProvider.generateUserId(data[i]);
    						data[i].online = me.app.context.userStateProvider.checkUserOnline(data[i].userId);
    					}
    					
    					me.friendList[userId] = data;
    					//console.log('-----' + userId)
    					//console.log('-----' + me.friendList[userId].length);
    					me.updateFetchStatus(userId, true);
    				}
    				
    				callback(error, data);
    			}, userId, token);
    	
    	//this.updateFetchStatus(userId, true);
    };
};
