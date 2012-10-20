/*
user state provider
*/


exports.userStateProvider = (function()
{
  return {
    userStates: { }

  	, userToken: { }
  	
  	, userIdToken: { }
  
    , getUser: function(userid) {
      return this.userStates[userid];
    }
    
    , userIsOnline: function(userid, user_socket) {
      if (!this.userStates[userid])
      {
        this.userStates[userid] = {}; 
      } 
      
      this.userStates[userid].userId = userid;
      this.userStates[userid].socket = user_socket;
      this.userStates[userid].online = true;
      this.userStates[userid].encryptedUserId = userid;
    }

    , userIsOffline: function(userid) {
      if (this.userStates[userid]) {
        delete this.userStates[userid];
      }
    }

    , checkUserOnline: function(userId) {
    	console.log('test checkuser online ' + userId);
      return this.userStates[userId] != undefined && this.userStates[userId].online;
    }
    
    , encryptUserId: function(userId) {
    	return userId;
    }
    
    , generateUserId: function(user) {
    	if (!user.firstName || !user.lastName || !user.headline) {
    		throw "Invalid user object";
    	}
    	
    	return user.firstName + "." + user.lastName;
    }
    
    , setUser: function(userId, user) {
    	this.userStates[userId] = user;
    }
    
    , getUser: function(userId) {
    	return this.userStates[userId];
    }
    
    , setUserToken: function(tokenId, token) {
    	if (this.userToken[tokenId]) {
    		delete this.userToken[tokenId];
    	}
    	
    	this.userToken[tokenId] = token;
    }
    
    , getUserToken: function(tokenId) {
    	return this.userToken[tokenId];
    }
    
    , setUserIdToken: function(userId, token) {
    	if (this.userIdToken[userId]) {
    		delete this.userIdToken[userId];
    	}
    	
    	this.userIdToken[userId] = token;
    }
    
    , getUserIdToken: function(userId) {
    	return this.userIdToken[userId];
    }
  };
})();
