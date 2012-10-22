/// Class responsible for handling chat related user interaction..
/// dialogManager = new DialogManager(name, function(name, data) {
/// });
/// 
/// all the events that this dialogManager want's outside world to know, will
/// use the notify using the 'listener'
///
function DialogManager(name, listener) {
	this.listener = listener;
	
	/// return the chat dialog of the given user
	this.findDialogForUser = function(userId /*str*/) {
		
	};
	
	/// create dialog for the given user
	this.createDialogForUser = function(userId /*str*/) {
		
	};
	
	/// destroy dialog (close)
	this.destroyDialogForUser = function(userId /*str*/) {
		
	};
	
	/// add a new incoming chat message
	this.addChatMessage = function(dialog /*object*/, message /*str*/) {
		
	};
	
	/// get the chat message typed to be sent
	this.getInputMessage = function(dialog /*object*/) {
		
	};
	
	/// clear the chat area
	this.clearChatMessage = function(dialog /*object*/) {
		
	};
	
	/// clear chat input area
	this.clearChat = function(dialog /*object*/) {
		
	};
}