//滿意度調查 
var Survey =
{
	hasAgentPart: false,
	
	getForm: function(hasAgentPart)
    {
        Survey.hasAgentPart = hasAgentPart;
        
        //alert("hasAgentPart -> " + hasAgentPart + "\r\nWebChat.isEverInAgentService -> " + WebChat.isEverInAgentService);
		//if ($("#Survey").length == 0) {
	    //}                  

        var html = "<div class=\"form-group\">"
                + WebChat.text("SurveyRobotInfo")
                + "</div>"
                + "<div class=\"form-group\">"
                + Survey.getRadios("SurveyRobotRadio")
                + "</div>";

        html += "<div id=SurveyAgentZone class=\"form-group\" style=\"display:none;\">"
                + "<div>"
                + WebChat.text("SurveyAgentInfo")
                + "</div>"
                + "<div>"
                + Survey.getRadios("SurveyAgentRadio")
                + "</div>"
                + "</div>";

        html += "<div class=\"form-group\">"
            + "<div>"
            + WebChat.text("SurveyCommentInfo")
            + "</div>"
            + "<textarea id=SurveyComment maxlength=200></textarea>"
            + "</div>";

        //html += "<div>"
        //    + "<input type='button' value='" + WebChat.textResource["Ok"] + "' id='submitSurveyButton'>"
        //    + "</div>";
        //    + "</div>";

        return html;
	},
	
	getRadios: function(name)
	{
		var items = WebChat.text("SurveyRadioItems").split("|");
		var buffer = [];
		for (var i = 0; i < items.length; ++i) {
			var value = 5 - i;
			var id = name + "_" + value;
			if (i > 0) {
				buffer.push("&nbsp;");
			}
			buffer.push("<input type=radio name=" + name + " id=" + id + " value=" + value + ">"); 
			buffer.push("<label for=" + id + ">" + items[i] + "</label>");
		}
		return buffer.join("");
	},
	
	checkForm: function()
	{
		var data = {
		    robotScore: $("input[name=SurveyRobotRadio]:checked", "#dvSurveyModalBody").val(),
		    agentScore: $("input[name=SurveyAgentRadio]:checked", "#dvSurveyModalBody").val(),
		    comment: $("#SurveyComment").val(),
		    hasAgentPart: Survey.hasAgentPart
		};
		//alert(JSON.stringify(data));
		if (data.robotScore == null) {
			alert(WebChat.text("SelectRobotSatisfactionAlert"));
			return null;
		}
		if (Survey.hasAgentPart && data.agentScore == null) {
			alert(WebChat.text("SelectAgentSatisfactionAlert"));
			return null;
		}
		return data;
    },
    
    submitSurvey: function () {
        var data = Survey.checkForm();
        
        if (data != null) {
            WebChat.submitSurvey(data);
        }
    },

    SurveySuccessMessage: function () {
        WebChat.addSystemMessage(WebChat.text("SurveySuccessMessage"));
        $("#SurveyModal").modal("hide");
        //$("#submitSurveyButton").text(WebChat.text("SurveySuccessbutton"));
        //$("#submitSurveyButton").attr("disabled", "disabled");
        $("#SurveyButton").css("display","none");
        
    }

};
