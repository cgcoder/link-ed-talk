/// Class responsible for handling chat related user interaction..
/// dialogManager = new DialogManager(name, function(name, data) {
/// });
/// 
/// all the events that this dialogManager want's outside world to know, will
/// use the notify using the 'listener'
///
function DialogManager(divName, listener) {
	this.listener = listener;
	this.divName = divName;
	
	this.divId = '#' + this.divName;
		
	/// return the chat dialog of the given user
	this.findDialogForUser = function(userId /*str*/) {
		return 'dialog_' + userId;
	};
	
	/// create dialog for the given user
	this.createDialogForUser = function(userId /*str*/) {
		divObj = $(this.divId);
		
		newDivName = this.divName + '_' + userId;
		newDivId = '#' + newDivName;
		
		$('<div></div>', {
			id: newDivName,
			"class": "draggable-window"
		}).appendTo(divObj);
		
		$('<div></div>', {
			"class": "dialog-title",
			id: newDivName + "_1"
		}).appendTo($(newDivId));
		
		$('<div></div>', {
			"class": "right",
			"style": "padding-right: 2px;"
		}).appendTo($(newDivId + "_1"));
		
		$('<div></div>', {
			"class": "dialog-body"
		}).appendTo($(newDivId));
		
		$('<textarea rows="2" cols="42" style="font-size: 12px;"></textarea>').
			appendTo($(newDivId));
		
		$('<div></div>', {
			"class": "dialog-status"
		}).appendTo(newDivId);
		
		$(newDivId).draggable();
		
		$(newDivId + "_1").hover(function() {
			$(newDivId).draggable({ disabled: false });
		}, function() {
			$(newDivId).draggable({ disabled: true });
		});
		
		return newDivId;
	};
	
	this.setTitleForDialog = function(dialog, title) {
		$(dialog + "_1").append(title);
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