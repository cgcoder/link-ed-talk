/*
user state provider
*/


exports.userStateProvider = (function()
{
  return {
    userStates: { }

  	, userToken: { }
  
    , getUser: function(userid) {
      return this.userStates[userid];
    }
    
    , userIsOnline: function(userid, user_socket) {
      if (!this.userStates[userid])
      {
        this.userStates[userid] = { id: userid}; 
      } 
      
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
    
    , setUserToken: function(tokenId, token) {
    	if (this.userToken[tokenId]) {
    		delete this.userToken[tokenId];
    	}
    	
    	this.userToken[tokenId] = token;
    }
    
    , getUserToken: function(tokenId) {
    	return this.userToken[tokenId];
    }
  };
})();
