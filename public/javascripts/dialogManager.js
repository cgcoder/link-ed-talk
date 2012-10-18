function format() {
	args = arguments;
	
	strFormat = args[0];
	
	if (strFormat.replace) {
		for(i = 1; i < args.length; i++) {
			fmt = "{" + (i-1) + "}";
			strFormat = strFormat.replace(fmt, args[i]);
		}
	}
	
	return strFormat;
}

function DialogManager() {
	this.dialogIdx = 0;
	this.top = 0;
	this.left = 410;
	this.friendManager = null;
	
	this.newDialog = function() {
		
		dialogId = format("chatDialog{0}", this.dialogIdx);

		htmlText = this.getDialogBoxHtml(dialogId);
		$("#chatAreaContainer").append(htmlText);
		this.dialogIdx = this.dialogIdx + 1;
		$("#" + dialogId).css({ left: this.left + "px", top: this.top + "px"});
		this.left = this.left + 330;
		this.initDialog(dialogId);
		return dialogId;
	};
	
	this.getDialogBoxHtml = function (dialogId, title) {
		var htmlText = "<div class='chatFrame' id='{0}'>" + 
							   "<div class='chatFrameTitle'>{1}</div>" + 
								"<div class='chatFrameBody'>" + 
									"<div class='chatArea'>" + 
										"<ul class=''>" + 
											"<li>test</li>" + 
										"</ul>" + 
									"</div>" + 
									"<div class='chatInputArea'>" + 
										"<table>" + 
											"<tr>" +
												"<td><textarea cols='30' rows='3'></textarea></td>" + 
												"<td><button>send</button></td>" +
											"</tr>" + 
										"</table>" + 
									"</div>" + 
								"</div>" + 
							"</div>";
	
		return format(htmlText, dialogId, title);
	};
	
	this.addMessage = function(dialogId, message) {
		$("#" + dialogId).find(".chatFrameBody")
						.find(".chatArea")
						.find('ul')
						.append(format("<li>{0}</li>", message));
	};
	
	this.eventDispatcher = function(event, dialogId) {
		if (this.friendManager) {
			this.friendManager.dialogListener(event, dialogId);
		}
	};
	
	this.initDialog = function(dialogId) {
		
		var me = this;
		
		$("#" + dialogId).find(".chatFrameBody")
						.find(".chatInputArea")
						.find('table')
						.find('tr')
						.find('td')
						.find('button')
						.click( function() {
							me.eventDispatcher('send-message', dialogId); 
						});
	};
	
	this.enableSendButon = function(dialogId) {
		
	};
	
	this.disableSendButton = function(dialogId) {
		
	};
	
	this.getInputText = function(dialogId) {
		return $("#" + dialogId).find(".chatFrameBody")
						.find(".chatInputArea")
						.find('table')
						.find('tr')
						.find('td')
						.find('textarea').val();
	};
	
	this.setInputText = function(dialogId, str) {
		$("#" + dialogId).find(".chatFrameBody")
			.find(".chatInputArea")
			.find('table')
			.find('tr')
			.find('td')
			.find('textarea').val(str);
	};
}