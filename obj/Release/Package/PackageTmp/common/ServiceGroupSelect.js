//選擇服務群組, 目前使用jQuery UI, 未來要改掉
var ServiceGroupSelect =
{
	callback: null,
	
	show: function(groups, callback)
	{
		ServiceGroupSelect.callback = callback;

        if ($("#ServiceGroupSelect").length == 0) {
			var html	= "<div class=DialogInfo>"
						+ 	WebChat.textResource["ServiceGroupSelectInfo"]
						+ "</div>"
						+ "<div id=ServiceGroupSelectBody></div>";
			$("<div id=ServiceGroupSelect class=DialogContent>").appendTo(document.body);
			$("#ServiceGroupSelect").html(html);
		}

        var buffer = [];

        buffer.push("<ul id=ServiceGroupSelectMenu>")

        for (var i = 0; i < groups.length; ++i) {
			var group = groups[i];
			buffer.push("<li id='" + group.id + "'>" + group.name + "</li>");
		}

        buffer.push("</ul>");

        $("#ServiceGroupSelectBody").html(buffer.join(""));
		$("#ServiceGroupSelectMenu").menu({
			select	: ServiceGroupSelect.doSelect			
		});
		
		var buttons = [{
	    	text	: WebChat.textResource["Cancel"],
	    	click	: function() {$(this).dialog("close");}
	    }];

        $("#ServiceGroupSelect").dialog({
			modal		: true,
			resizable	: false,
			buttons		: buttons
		});
	},
	
	doSelect: function(event, ui)
	{
		var groupId = ui.item.attr("id");
		$("#ServiceGroupSelect").dialog("close");
		ServiceGroupSelect.callback(groupId);
	}
};
