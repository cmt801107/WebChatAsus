//處理 [link action=""] 指定的動作 
var LinkAction =
{
    doClick: function (event) {
        var action = event.target.getAttribute("action");

        if ((action == "ToAgent") || ((action == "ChangeAgent"))) {
            if (WebChat.needlogin == "false")
                CustInfo.show();
            else
                WebChat.doApplyAgentButtonClick();       
        }

        if (action == "LeaveWord") {
            LeaveWord.show();
        }

        if (action == "RestartChat") {
            $("#MessageList").html("");
            WebChat.startChat();
            $('.modal-popup .pop-content ol li').removeClass('feedback-active');
        }

        if (action == "StopWaitting") {
            WebChat.stopChat();
        }

    },

    doSendMessage: function (message) {
        //alert(message);
        WebChat.doSendMessage(message);
    },

    doOpenUrl: function (url) {
        //LinkAction.doNavigateUrl(url);
        if (window.parent.innerWidth <= '414') {
            window.open(url);
        }
        else {
            if (window.parent.EcpWebChatEntry != null) {
                if (!window.parent.EcpWebChatEntry.dvP4Page.disabled) {
                    window.parent.EcpWebChatEntry.OpenP4Page(url);
                }
                else {
                    WebChat.OpenP4Page(url, 0);
                }
            }
            else {
                WebChat.OpenP4Page(url, 0);
            }
        }
    },

    doOpenP4Url: function (url) {
        //LinkAction.doNavigateUrl(url);
        if (window.parent.EcpWebChatEntry != null) {
            if (!window.parent.EcpWebChatEntry.dvP4Page.disabled) {
                window.parent.EcpWebChatEntry.OpenP4Page(url);
            }
            else {
                WebChat.OpenP4Page(url, 1);
            }
        }
        else {
            WebChat.OpenP4Page(url, 1);
        }
    },

    //doNavigateUrl: function (url) {
    //}zxZ
};
