//WebChat主程式
var WebChat =
{
    isGetLocation: Config.isGetLocation,

    CRMGatewayUrl: Config.CRMGatewayUrl,

    ECPUrl: Config.ECPUrl,

    chatId: null,

    lastchatId: null,

    serverSystemTypeOfWebPage: "",

    from: "",

    data: "",

    lunguage: "",

    country: "",

    treeId: "",

    rootTreeId: "",

    location: null,

    isWorkTime: false,

    isInAgentService: false,

    isEverInAgentService: false,

    webSocket: null,

    doAgentButtonCklick: false,

    messageIndex: 0,

    hintHtmlMap: {},

    SurveyLastIndex: "",

    tenantId: "",

    tenantInfo: "",

    asusChatId: "",

    Score: null,

    Suggest: null,
    
    startChatret: null,

    loginSuccess: false,

    //附加按鈕定義
    enableConditions:
	{
	    "ApplyAgentButton": "false",
	    "AttachmentButton": "WebChat.chatId != null && WebChat.isInAgentService",
	    "ImageButton": "false",
	    "TopButton": "!WebChat.isInAgentService",
	    "BackButton": "!WebChat.isInAgentService",
	    "btn-recommendation": "WebChat.chatId != null && WebChat.isInAgentService"
	},

    //選單被點擊，實現超鏈功能
    optionClicked: function (optionNo, innerNo) {
        if (WebChat.isInAgentService == true)
            return;
        else {
            var messageShow = {
                type: Constant.TYPE_TEXT,
                content: '' + optionNo
            };
            var elementId = WebChat.addMessage(messageShow);

            var messageSend = {
                type: Constant.TYPE_TEXT,
                content: '' + innerNo
            };
            WebChat.chatId == WebChat.lastchatId;
            WebChat.sendMessage(messageSend, elementId);
        }
    },

    //選單調查被點擊 
    optionSurveyClicked: function (surveyText) {
        if (WebChat.isInAgentService == true)
            return;
        else {
            if (WebChat.SurveyLastIndex == WebChat.messageIndex) {
                var messageShow = {
                    type: Constant.TYPE_TEXT,
                    content: '' + surveyText
                };
                var elementId = WebChat.addMessage(messageShow);

                var messageSend = {
                    type: Constant.TYPE_TEXT,
                    content: '' + surveyText
                };
                WebChat.sendMessage(messageSend, elementId);
            }
        }
    },

    doLoad: function () {
        WebChat.serverSystemTypeOfWebPage = clientData.urlArgs.serverSystemTypeOfWebPage;
        WebChat.from = clientData.urlArgs.from;
        WebChat.treeId = clientData.urlArgs.treeId;
        WebChat.rootTreeId = clientData.urlArgs.rootTreeId;
        WebChat.language = clientData.urlArgs.language;
        WebChat.country = clientData.urlArgs.country;
        WebChat.tenantId = Util.getParameterByName("tenantId");

        //Hint Modal Init.
        $("#AttentionButton").text(WebChat.text("AttentionButtonText"));
        $("#AttentionButton").click(function () { WebChat.showHint("attention"); });
        $("#HelpButton").text(WebChat.text("HelpButtonText"));
        $("#HelpButton").click(function () { WebChat.showHint("help"); });

        WebChat.hintHtmlMap["attention"] = WebChat.text("AttentionMessage");
        WebChat.hintHtmlMap["help"] = WebChat.text("HelpMessage");

        //Menu Init.
        $("#HotQuestionButton").text(WebChat.text("HotQuestionButtonText"));
        $("#HotQuestionButton").click(function () { WebChat.OpenExtWeb("hot_question"); });

        $("#OnlineLeaveButton").text(WebChat.text("OnlineLeaveButtonText"));
        $("#OnlineLeaveButton").click(function () { LinkAction.doClick(event); });

        $("#ExitButton").text(WebChat.text("ExitButtonText"));
        $("#ExitButton").click(WebChat.doExitButtonClick);

        //Others Init.
        $("#nvbarTitle").text(WebChat.text("Title"));

        $("#ApplyAgentButton").text(WebChat.text("ApplyAgentButtonHint"));
        $("#ApplyAgentButton").click(WebChat.doApplyAgentButtonClick);
        //$("#AttachmentButton").attr("title", WebChat.text("AttachmentButtonHint"));
        $("#AttachmentButton").click(WebChat.doAttachmentButtonClick);  
        $("#ImageButton").attr("title", WebChat.text("ImageButtonHint"));
        $("#ImageButton").click(WebChat.doImageButtonClick);
        $("#CloseButton").text(WebChat.text("Close"));
        $("#CloseButton").click(WebChat.doCloseButtonClick);
      
        //Asus recommendation
        $("#btn-recommendation").click(WebChat.doRecommendationClick);
        $(".close-btn").click(function () {
            $("#lx-recommendation").removeClass("active");
        });
        $('.questionnaire').on('click', function () {
            Survey.Questionnaire($(this).data('s'));
        });
        $('#Mail_Confirm').on('click', function () { Survey.Mail(); $("#lx-recommendation").removeClass("active"); });
        $('#Feedback_Confirm').on('click', function () { Survey.Feedback(); $("#lx-recommendation").removeClass("active"); });


        $("#SendButton").click(WebChat.doSendButtonClick);
        $("#TopButton").click(WebChat.doTopButtonClick);
      
        $("#BackButton").click(WebChat.doBackButtonClick);
        //Press Enter to Send Init.
        $("#Editor").keypress(function (event) {
            if (event.shiftKey == true) {
                if (event.keyCode == 13) {
                }
            } else {
                if (event.which == 13) {
                    WebChat.doSendButtonClick();
                    return false;
                }
            }
        });

        //Click Menu Text, then close menu
        $(document).on('click', '.navbar-collapse.in', function (e) {
            if ($(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle') {
                $(this).collapse('hide');
            }
        });

        //Bottom Function Init.

        $("#Editor").css("width", parseInt($(window).width()) - 84);
        $(window).on('resize', function () { WebChat.resizeEditorWidth(); });
        
        if (WebChat.language == "IW") {
            $("#Editor").css("text-align", "right");
            $("#Editor").css("direction", "rtl");
        }

        //Leave Words Init.
        $("#LeaveWordModalTitle").html(WebChat.text("LeaveWord"));

        $("#LeaveWordButton").click(function () {
            LeaveWord.send();
        });

        $("#LeaveWordClose").click(function () {
            LeaveWord.close();
        });

        $("#btnP4PageClose").click(function () {
            WebChat.CloseP4Page();
        });
        $.when(WebChat.getTenantInfo()).done(function () {
            $("#SendButton").text(WebChat.tenantInfo.sendButtonText);
            $("#Editor").attr("placeholder", WebChat.tenantInfo.sendMessageMaxLengthHint);
            $("#TopButton").text(WebChat.tenantInfo.backToTopLevelText);
            $("#BackButton").text(WebChat.tenantInfo.backToUpLevelText);
            WebChat.startChat();
            WebChat.changeLoginform();
        });

        if (WebChat.isGetLocation) { //Henry Modified @ 2015/12/16 00:46
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
					function (position) {
					    WebChat.location = position.coords;
					    WebChat.updateLocation();
					},
					function (error) {
					    Util.log("get location failed. errorcode=" + error.code);
					    Util.log(error);
					}
				);
            }
        }
    },

    resizeEditorWidth: function () {
        if (WebChat.isInAgentService == false)
            $("#Editor").css("width", parseInt($(window).width()) - 84);
        else
            $("#Editor").css("width", parseInt($(window).width()) - 115);
    },

    P4HotQuestionsClick: function (msg) {
        WebChat.doSendMessage(msg);
        $("#ExtWebModal").modal("hide");
    },

    OpenExtWeb: function (key) {
        var sUrl = "ext_web/hot_questions/index.html";

        $("#ifExtWeb").attr("src", sUrl);
        $("#ifExtWeb").height(window.innerHeight * 0.8);

        $("#ExtWebModalTitle").html(WebChat.text("HotQuestionText"));
        $("#ExtWebModal").modal("show");
    },

    OpenP4Page: function (url, rwd) {
        var iRsizeRatio = 1;

        if ((url.indexOf("http://") != 0) && (url.indexOf("https://") != 0)) {
            //WebChat.OpenUrl(url);
            window.open(url);
        }
        else {
            $("#dvP4Page").css("display", "block");

            if (rwd == 0) {
                iRsizeRatio = window.innerWidth / 1080;

                $("#ifP4Url").attr("src", url);
                $("#ifP4Url").attr("width", "1080px");
                $("#ifP4Url").attr("height", "1920px");
                $("#ifP4Url").css("-webkit-transform", "scale(" + iRsizeRatio.toString() + ")");
            }
            else {
                $("#ifP4Url").attr("src", url);
                $("#ifP4Url").attr("width", "98%");
                $("#ifP4Url").attr("height", "95%");
                $("#ifP4Url").css("-webkit-transform", "scale(1)");
            }
        }
    },

    CloseP4Page: function () {
        $("#ifP4Url").attr("src", "");
        $("#dvP4Page").css("display", "none");
    },

    OpenUrl: function (url) {
        location.href = url;
    },

    doBeforeUnload: function () {
        window.onunload = function () {
            WebChat.stopChat();
        }
        return "";
    },

    doApplyAgentButtonClick: function () {
        if (!WebChat.doAgentButtonCklick) {
            WebChat.doAgentButtonCklick = true;
            if (WebChat.defaultlogin == 'true') {
                WebChat.memberlogin();
            }
            else {
                if (confirm(WebChat.tenantInfo.gotoAgentHint)) {
                    WebChat.memberlogin();
                }
                    //no_service
                else {
                    return;
                }
            }
        }
        else
            return;
    },
    doRecommendationClick:function(){
        if ($("#lx-recommendation").hasClass("active"))
            $("#lx-recommendation").removeClass("active");
        else
            $("#lx-recommendation").addClass("active");
    },

    memberlogin: function () {
        var jdo = $.Deferred();
        var lang = WebChat.tenantId.toLowerCase().split('-')[1];
        var loginurl = '';
        if (WebChat.tenantId == "ZH-CN")
            loginurl = 'https://www.asus.com.cn/api/asus_api_data.aspx?lang=';
        else
            loginurl = 'https://www.asus.com/api/asus_api_data.aspx?lang=';
        //console.log(lang);
        $.ajax({
            url: loginurl + lang + '&key=wechat0001',
            dataType: "jsonp",
            jsonp: 'callback',
            cache: false,
            jsonpCallback: '_asus_CompareInfo_fn',
            success: function (res) {
                if (res.loginID) {
                    var name = '';
                    if ((res.firstname) || (res.lastname)) {
                        name = res.firstname + " " + res.lastname;
                    }
                    else {
                        name = res.nickName;
                    }
                    var data = {
                        custID: res.loginID,
                        displayName: name,
                        phoneNo: res.mobile || "",
                        email: res.loginID,
                        problem: ""
                    };
                    WebChat.data = data;
                    WebChat.loginSuccess = true ; 

                }
                else {
                    WebChat.loginSuccess = false ; 
                    var expire_time = 1; // 過期日期(分)
                    var d = new Date();
                    d.setTime(d.getTime() + (expire_time * 60 * 1000));
                    var expires = "expires=" + d.toGMTString();
                    document.cookie = "defaultlogin=true" + ";" + expires ;
                    $('#ReturnURL').val(window.parent.location.href);
                    $('#btn_login_asus').click();
                }
                jdo.resolve();
            }
        });
        return jdo.promise();
    },

    memberlogin_withdefaultlogin: function () {
        var jdo = $.Deferred();
        var lang = WebChat.tenantId.toLowerCase().split('-')[1];
        var loginurl = '';
        if (WebChat.tenantId == "ZH-CN")
            loginurl = 'https://www.asus.com.cn/api/asus_api_data.aspx?lang=';
        else
            loginurl = 'https://www.asus.com/api/asus_api_data.aspx?lang=';
        //console.log(lang);
        $.ajax({
            url: loginurl + lang + '&key=wechat0001',
            dataType: "jsonp",
            jsonp: 'callback',
            cache: false,
            jsonpCallback: '_asus_CompareInfo_fn',
            success: function (res) {
                if (res.loginID) {
                    var name = '';
                    if ((res.firstname) || (res.lastname)) {
                        name = res.firstname + " " + res.lastname;
                    }
                    else {
                        name = res.nickName;
                    }
                    var data = {
                        custID: res.loginID,
                        displayName: name,
                        phoneNo: res.mobile || "",
                        email: res.loginID,
                        problem: ""
                    };
                    WebChat.data = data;
                    WebChat.loginSuccess = true ; 
                }
                else {
                    WebChat.loginSuccess = false ; 
                }
                jdo.resolve();
            }
        });
        return jdo.promise();
    },

    doTopButtonClick: function () {
        WebChat.linkClicked(WebChat.tenantInfo.backToTopLevelCode);
    },

    doBackButtonClick: function () {
        if (!WebChat.chatId == null) {
            return;
        }
        WebChat.linkClicked(WebChat.tenantInfo.backToUpLevelCode);
    },

    doAttachmentButtonClick: function () {
        if (!WebChat.isButtonEnabled(this)) {
            return;
        }
        $("#fileupload").click();
    },

    doImageButtonClick: function () {
        if (!WebChat.isButtonEnabled(this)) {
            return;
        }
        $("#imageupload").click();
    },

    doCloseButtonClick: function () {
        var callback = function () {
            WebChat.chatId = null;
            window.close();
        };
        WebChat.ajax({
            url: WebChat.CRMGatewayUrl + "openapi/web/chat/stop",
            data: { chatId: WebChat.chatId },
            error: callback,
            success: callback
        });
    },

    doSendButtonClick: function (event) {
        if (!WebChat.isButtonEnabled(this)) {
            return;
        }
        var msg = $("#Editor").val().replace(/<div>/g, "<br>").replace(/<\/div>/g, "");
        var content = Util.unescapeHtml(msg);
        if (content != null && content.trim() != "") {
            $("#Editor").val("");
            var message = {
                type: Constant.TYPE_TEXT,
                content: content
            };

            var elementId = WebChat.addMessage(message);
            WebChat.sendMessage(message, elementId);
        }

    },

    doSendMessage: function (SendMessage) {
        if (!WebChat.isButtonEnabled(this)) {
            return;
        }
        var msg = SendMessage.replace(/<div>/g, "<br>").replace(/<\/div>/g, "");

        var content = Util.unescapeHtml(msg);
        if (content != null && content.trim() != "") {
            var message = {
                type: Constant.TYPE_TEXT,
                content: content
            };

            var elementId = "";
            if (msg.indexOf("faqvote:") != 0)
                elementId = WebChat.addMessage(message);
            else
                elementId = "ChatMessage_" + ++WebChat.messageIndex;

            WebChat.sendMessage(message, elementId);
        }
    },

    doImageClick: function (event) {
        var image = event.srcElement || event.target;
        var url = $(image).attr("url");
        if (!Util.isEmpty(url)) {
            window.open(url);
        }
    },
    doExitButtonClick: function () {
        if (parent.EcpWebChatEntry != null) {
            parent.EcpWebChatEntry.ClosePanel();
        }
    },

    //-----------------------------------------------------------------------
    // chat control methods
    //-----------------------------------------------------------------------
    checkIsAgentWorkTime: function () {
        WebChat.ajax({
            url: WebChat.CRMGatewayUrl + "openapi/web/agent/isworktime",
            error: function () { },
            success: function (ret) {
                //Util.log("[/agent/isworktime] isWorkTime = %s", ret.isWorkTime);
                WebChat.isWorkTime = ret.isWorkTime;
            }
        });
    },

    //選單調查被點擊
    linkClicked: function (surveyText) {
        if (WebChat.isInAgentService == true)
            return;
        else {
            var messageShow = {
                type: Constant.TYPE_TEXT,
                content: '' + surveyText
            };

            var messageSend = {
                type: Constant.TYPE_TEXT,
                content: '' + surveyText
            };
            if (surveyText == WebChat.tenantInfo.applyAgentCode) {
                if (!WebChat.doAgentButtonCklick) {
                    var elementId = WebChat.addMessage(messageShow);
                    WebChat.sendMessage(messageSend, elementId);
                }
            }
            else
                WebChat.sendMessage(messageSend, elementId);
        }
    },

    gotoLeaveWord: function () {

        LeaveWord.show();

    },


    startChat: function () {
        WebChat.Score = null;
        WebChat.Suggest = null;
        console.log("WebChat.Score" + WebChat.Score + " " + "WebChat.Suggest: " + WebChat.Suggest);
        var treeId;
        if (Util.getCookie('defaultlogin') == 'true')
            treeId = Util.getCookie('treeId');
        else
            treeId = WebChat.treeId;

        WebChat.ajax({
            url: WebChat.CRMGatewayUrl + "openapi/web/chat/start",
            data: {
                _header_:
				{
				    tokenId: "",
				    language: WebChat.language == null ? "zh-tw" : WebChat.language
				},
                from: WebChat.from == null ? "web" : WebChat.from,
                language: WebChat.language == null ? "zh-tw" : WebChat.language,
                country: WebChat.country == null ? "TW" : WebChat.country,
                tenantId: WebChat.tenantId == null ? "ZH-TW" : WebChat.tenantId,
                treeId: WebChat.treeId == null ? "001.001.001" : treeId,
                rootTreeId: WebChat.rootTreeId ==null? WebChat.treeId : WebChat.rootTreeId ,
                entityType: "",
                entityId: "",
                mode: "",
                userId: "",
                userName: "",
                userEMail: "",
                identifyBy: "FPId",
                identifyValue: "GUEST",
                fromDevice: WebChat.from == null ? "web" : WebChat.from,
                serverSystemTypeOfWebPage: WebChat.serverSystemTypeOfWebPage
            },
           
            error: "StartChatErrorMessage",
            success: function (ret) {
                Util.log("[chat/start] chatId = %s", ret.chatId);
                //Util.log(JSON.stringify(ret));
                WebChat.messageIndex = 0;
                WebChat.chatId = ret.chatId;
                document.cookie = "treeId=" + WebChat.treeId;
                var greetingWords = "";
                WebChat.startChatret = ret ; 
                if (ret.senderType.toLowerCase() == 'textivr') { //from ChatIVR 

                    greetingWords = ret.ivrInfo.greetingWords;
                    WebChat.socket = new Jocket({
                        server: WebChat.CRMGatewayUrl,
                        path: "/jocket/gw/webchat",
                        params: { chatId: WebChat.chatId },
                        upgrade: false,
                    });
                    WebChat.socket.on("open", WebChat.doSocketOpen);
                    WebChat.socket.on("close", WebChat.doSocketClose);
                    WebChat.socket.on("message", WebChat.doSocketMessage);
                   
                    if (Util.getCookie('defaultlogin') == 'true' || ret.ivrInfo.nodeInfo.enabledIVR == 'N') {//|| ret.ivrInfo.nodeInfo.enabledIVR == 'Y'                   
                        WebChat.linkClicked(WebChat.tenantInfo.applyAgentCode);                    
                    }
                    else
                        WebChat.addMessage(ret);

                }

                else { //from XiaoI				    
                    greetingWords = WebChat.text("RobotGreeting");

                    WebChat.addMessage({
                        category: Constant.CATEGORY_CHAT,
                        senderType: Constant.SENDER_TYPE_ROBOT,
                        type: Constant.TYPE_TEXT,
                        content: greetingWords
                    });

                    var path = WebChat.CRMGatewayUrl + "jocket/gw/webchat?chatId=" + WebChat.chatId;
                    WebChat.socket = new Jocket(path, { transports: ["polling"] });
                    WebChat.socket.on("open", WebChat.doSocketOpen);
                    WebChat.socket.on("close", WebChat.doSocketClose);
                    WebChat.socket.on("message", WebChat.doSocketMessage);

                }

                WebChat.refreshButtonStatus();
                if (ret.disableIVRService) {

                    WebChat.selectServiceGroup();

                }
            }
        });
    },

    stopChat: function () {
        console.log('socket close');
        //alert("WebChat.chatId : " + WebChat.chatId);
        if (WebChat.chatId != null) {
            WebChat.ajax({
                url: WebChat.CRMGatewayUrl + "openapi/web/chat/stop",
                data: { chatId: WebChat.chatId },
            });
            WebChat.chatId = null;
        }
        WebChat.isInAgentService = false;
        WebChat.refreshButtonStatus();
    },

    selectServiceGroup: function () {

        WebChat.ajax({
            url: WebChat.CRMGatewayUrl + "openapi/web/servicegroup/list",
            error: "ServiceGroupErrorMessage",
            success: function (ret) {
                if (ret.groups.length == 0) { //目前沒有線上工作群組 (無Agent值班)
                    //LeaveWord.show();
                    WebChat.addSystemMessageAsDialog(WebChat.text("no_agent"));
                }
                else if (ret.groups.length == 1) {
                    //只有一個可用服務群組，那直接申請此服務群組的人工服務
                    WebChat.applyAgent(ret.groups[0].id);
                }
                else {
                    //有多個服務群組的情況下，需要終端用戶選擇一個服務群組
                    ServiceGroupSelect.show(ret.groups, WebChat.applyAgent);
                }
            }
        });
    },

    applyAgent: function (serviceGroup) {

        WebChat.addSystemMessageAsDialog(WebChat.text("ApplyAgentMessage"));
        WebChat.refreshButtonStatus();

        var data = {
            chatId: WebChat.chatId,
            identifyBy: "FPId",
            identifyValue: "GUEST",
            serviceGroup: serviceGroup,
            fromDevice: clientData.urlArgs.fromDevice,
            fromTitle: clientData.urlArgs.fromTitle,
            fromUrl: clientData.urlArgs.fromUrl
        };

        WebChat.ajax({
            url: WebChat.CRMGatewayUrl + "openapi/web/agent/apply",
            data: data,
            error: function () {
                //WebChat.addSystemMessage(WebChat.text("ApplyAgentErrorMessage"));
                WebChat.addSystemMessageAsDialog(WebChat.text("no_agent"));
                if (WebChat.webSocket != null) {
                    WebChat.webSocket.close();
                    WebChat.webSocket = null;
                }
                WebChat.refreshButtonStatus();
            },
            success: function (ret) {
                Util.log("[agent/apply] applying, please wait...");
                if (ret.chatId != null) {
                    WebChat.chatId = ret.chatId;
                }
            }
        })

    },

    sendMessage: function (message, elementId) {
        if (WebChat.chatId == null) {
            WebChat.setMessageFailed(elementId, true);
            $("#MessageList").html("");
            $('.modal-popup .pop-content ol li').removeClass('feedback-active');
            WebChat.startChat();
            
        }
        else {
            message.chatId = WebChat.chatId;
            message.serverSystemTypeOfWebPage = WebChat.serverSystemTypeOfWebPage; //@20160428
            //檢查消息長度
            var sendMessageMaxLength = WebChat.tenantInfo.sendMessageMaxLength;
            if (message.content.length > sendMessageMaxLength) {
                WebChat.addSystemMessage(WebChat.tenantInfo.sendMessageMaxLengthHint);
                return;
            }
            message.chatId = WebChat.chatId;
            var _header_ = {
                tokenId: "",
                language: WebChat.language
            };
            message._header_ = _header_;
            WebChat.ajax({
                url: WebChat.CRMGatewayUrl + "openapi/web/chat/istoAgent",
                data: message,
                success: function (ret) {
                    // alert(WebChat.doAgentButtonCklick);
                    if (ret.istoAgent == true) {
                        Util.log("istoAgent" + JSON.stringify(ret));
                        if (!WebChat.doAgentButtonCklick) {
                            if (Util.getCookie('defaultlogin') == 'true') {
                                document.cookie = "defaultlogin=false";
                                $.when(WebChat.memberlogin_withdefaultlogin()).done(function () {
                                    if (WebChat.loginSuccess == true){
                                        var data = WebChat.data;
                                        WebChat.submitUserMessage(data, message, elementId);
                                    }
                                    else
                                        WebChat.addMessage (WebChat.startChatret);
                                });
                            }
                            else {
                                if (confirm(WebChat.tenantInfo.gotoAgentHint)) {

                                    $.when(WebChat.memberlogin()).done(function () {
                                        var data = WebChat.data;
                                        WebChat.submitUserMessage(data, message, elementId);
                                    });
                                }
                                else
                                    return;
                            }
                        }
                        else
                            return;
                    } else {
                        WebChat.ajax({
                            url: WebChat.CRMGatewayUrl + "openapi/web/message/send",
                            data: message,
                            error: function () {
                                WebChat.setMessageFailed(elementId, true);
                                $("#MessageList").html("");
                                $('.modal-popup .pop-content ol li').removeClass('feedback-active');
                                WebChat.startChat();                             
                            },
                            success: function (ret) {
                                //Util.log("sendmessage: " + JSON.stringify(ret));
                                if (ret.chatId != null) {
                                    WebChat.chatId = ret.chatId;
                                }
                                if (ret.needAgent) {
                                    WebChat.addMessage({
                                        category: Constant.CATEGORY_CHAT,
                                        senderType: Constant.SENDER_TYPE_ROBOT,
                                        type: Constant.TYPE_TEXT,
                                        content: WebChat.text("AutoTransferToAgentMessage")
                                    });
                                }
                                else if (ret.content != null) {
                                    WebChat.addMessage(ret);
                                    if (typeof ret.ivrInfo.nodeInfo.treeId !== "undefined")
                                        document.cookie = "treeId=" + ret.ivrInfo.nodeInfo.treeId;
                                }
                            }
                        });
                    }
                }
            });
        }
    },

    submitUserMessage: function (data, message, elementId) {
        data.chatId = WebChat.chatId;
        WebChat.ajax({
            url: WebChat.CRMGatewayUrl + "openapi/web/chat/chatCustomData",
            data: data,
            success: function (ret) {
                message.chatId = WebChat.chatId;
                // 为了支持chatIvr和Robot两个访问入口
                message.serverSystemTypeOfWebPage = WebChat.serverSystemTypeOfWebPage;

                WebChat.ajax({
                    url: WebChat.CRMGatewayUrl + "openapi/web/message/send",
                    data: message,
                    error: function () {
                        if (elementId != null) {
                            WebChat.setMessageFailed(elementId, true);
                        }
                    },
                    success: function (ret) {
                        //alert("ret" + JSON.stringify(ret));
                        if (ret.chatId != null) {
                            WebChat.chatId = ret.chatId;
                        }
                        if (ret.needAgent) {
                            WebChat.addMessage({
                                category: Constant.CATEGORY_CHAT,
                                senderType: Constant.SENDER_TYPE_ROBOT,
                                type: Constant.TYPE_TEXT,
                                content: WebChat.text("AutoTransferToAgentMessage")
                            });
                        } else if (ret.content != null) {
                            WebChat.addMessage(ret);
                        }
                    }
                });
            }
        });
    },
    //-----------------------------------------------------------------------
    // other chat API
    //-----------------------------------------------------------------------

    updateLocation: function () {
        if (WebChat.chatId == null) {
            setTimeout(WebChat.updateLocation, 2000);
            return;
        }
        var data = {
            chatId: WebChat.chatId,
            location: { longitude: WebChat.location.longitude, latitude: WebChat.location.latitude }
        };
        WebChat.ajax({
            url: WebChat.CRMGatewayUrl + "openapi/web/location/update",
            data: data,
            error: function () {
                Util.log("update location failed.")
            }
        });
    },

    submitSurvey: function (data) {
        data.chatId = WebChat.chatId;
        WebChat.ajax({
            url: WebChat.CRMGatewayUrl + "openapi/web/survey/score",
            data: data,
            error: "SurveyErrorMessage",
            success: Survey.SurveySuccessMessage
        });
        $("#SurveyModal").modal("hide");
    },

    //-----------------------------------------------------------------------
    // message list methods
    //-----------------------------------------------------------------------

    addSystemMessage: function (content) {
        WebChat.addMessage({
            category: Constant.CATEGORY_SYSTEM,
            content: content
        });
    },

    addSystemMessageAsDialog: function (message) {
        var message = {
            type: Constant.TYPE_TEXT,
            senderType: Constant.SENDER_TYPE_ROBOT,
            content: message
        };

        WebChat.addMessage(message);
    },
    addMessage: function (message) {
        //Util.log(JSON.stringify(message));
        var category = (message.category || Constant.CATEGORY_CHAT).toLowerCase();
        var senderType = (message.senderType || Constant.SENDER_TYPE_USER).toLowerCase();
        var type = message.type || Constant.TYPE_TEXT; //.toLowerCase();
        var content = message.content;
        var optionlist = "";
        var messageList = document.getElementById("MessageList");
        var id = "ChatMessage_" + ++WebChat.messageIndex;
        var IW = "";
        if (WebChat.language == "IW")
            IW = "IW";
        if (category == Constant.CATEGORY_SYSTEM) {
            var html = "<div class=ChatSystemMessage id=" + id + ">";
            $(html).text(message.content).appendTo(messageList);
        }
        else if (category == Constant.CATEGORY_AD) {
            var html;
            if (Util.isEmpty(content.imageUrl)) {
                html = "<div class=TextActivityMessage id=" + id + ">"
						+ "<div>" + Util.escapeHtml(content.text) + "</div>"
						+ "</div>";
            }
            else {
                var imageHtml = "<img src='" + content.imageUrl + "'>";
                if (!Util.isEmpty(content.linkUrl)) {
                    imageHtml = "<a target=_blank href='" + content.linkUrl + "'>" + imageHtml + "</a>";
                }
                html = "<div class=ActivityMessage id=" + id + ">"
						+ imageHtml
						+ "<div>" + Util.escapeHtml(content.text) + "</div>";
                + "</div>";
            }
            $(messageList).append(html);
        }
        else {
            var align = senderType == Constant.SENDER_TYPE_USER ? "Right" : "Left";

            var senderClass = Util.upperFirstLetter(senderType);
            var time = Util.formatDate(new Date(), "HH:mm:ss");
            var contentHtml = "";

            if (senderType.toLowerCase() == 'textivr') {
                var Info = message.ivrInfo;
                var url = "";

                if (message.dataType == 'answer') {
                    url = message.answerDetail.url;
                    var imageUrl = message.answerDetail.imageUrl;

                    if (!Util.isEmpty(content)) {

                        if (typeof Info.greetingWords !== "undefined" && Info.greetingWords != "")
                            optionlist += Info.greetingWords + "<br>";

                        if (typeof Info.answer.description !== "undefined")
                            optionlist += Info.answer.description + "<br>";

                        if (typeof Info.childNodes !== "undefined" && Info.childNodes != "") {
                            optionlist += "<br>相關問題為:<br>";
                            for (var i = 0 ; i < Info.childNodes.length; i++) {
                                optionlist += "<a onclick=\"WebChat.optionClicked('"
                                + Info.childNodes[i].value
                                + "','"
                                + Info.childNodes[i].nodeId
                                + "','')\" >"
                                + Info.childNodes[i].value
                                + " "
                                + Info.childNodes[i].description
                                + "</a><br>";
                            }
                            optionlist += "<br>";
                        }
                        if (typeof Info.surveyConfig !== "undefined")
                            optionlist += Info.surveyConfig.surveryPreWords + "<br>";

                        if (typeof Info.surveyForOption !== "undefined") {
                            WebChat.SurveyLastIndex = WebChat.messageIndex;
                            for (var i = 0 ; i < Info.surveyForOption.length ; i++) {
                                optionlist += "<a id='SurveyOption' onclick=\"WebChat.optionSurveyClicked('"
                                            + Info.surveyForOption[i].value
                                            + "')\" >"
                                            + Info.surveyForOption[i].value + " "
                                            + Info.surveyForOption[i].description
                                            + "</a>";
                                if (Info.surveyConfig.surveyDirection == "vertical")
                                    optionlist += "<br>";
                                else
                                    optionlist += " ";
                            }
                        }
                       
                        if (typeof Info.gotoAgent !== "undefined" && WebChat.tenantInfo.showApplyAgentHint == true)
                            optionlist += "<br><br>" + WebChat.tenantInfo.applyAgentText;
                       
                        if (typeof Info.webLeaveWord !== "undefined")
                            optionlist += "<br><br>"
                                            + "<a onclick=\"LinkAction.doOpenUrl('"
                                            + Info.webLeaveWord.webLeaveWordHost
                                            + "')\">"
                                            + Info.webLeaveWord.leaveWordHint
                                            + "</a>";

                        if (typeof Info.endWords !== "undefined")
                            optionlist += "<br><br>" + Info.endWords;
                    }
            
                }

                else if (message.dataType == 'optionList') {
                    url = message.nodeDetail.url;
                    if (typeof Info.greetingWords !== "undefined" && Info.greetingWords != "")
                        optionlist = Info.greetingWords + "<br><br>";

                    for (var i = 0 ; i < Info.childNodes.length; i++) {
                        optionlist += "<a onclick=\"WebChat.optionClicked('"
                        + Info.childNodes[i].value
                        + "','"
                        + Info.childNodes[i].nodeId
                        + "','')\" >"
                        + Info.childNodes[i].value
                        + " "
                        + Info.childNodes[i].description
                        + "</a><br>";
                    }
                    if (typeof Info.gotoAgent !== "undefined" && WebChat.tenantInfo.showApplyAgentHint == true)
                        optionlist += "<br>" + WebChat.tenantInfo.applyAgentText + "<br>";

                    if (typeof Info.webLeaveWord !== "undefined")
                        optionlist += "<br><br>"
                                        + "<a onclick=\"LinkAction.doOpenUrl('"
                                        + Info.webLeaveWord.webLeaveWordHost
                                        + "')\">"
                                        + Info.webLeaveWord.leaveWordHint
                                        + "</a>";

                    if (typeof Info.endWords !== "undefined")
                        optionlist += "<br>" + Info.endWords;
                }

                else if (message.dataType == 'afterManyError') {
                    if (typeof Info.afterManyError !== "undefined")
                        optionlist += WebChat.tenantInfo.applyAgentText + "<br>";
                }
                else {
                    if (typeof Info.normalMessage !== "undefined") {
                        optionlist += Info.normalMessage;
                    }

                    if (typeof Info.userOperationError !== "undefined") {
                        optionlist += WebChat.tenantInfo.invalidKeywordsHint;
                    }

                    if (typeof Info.notInServiceTime !== "undefined") {
                        optionlist += Info.notInServiceTime;
                    }

                }
                if (!Util.isEmpty(url)) {
                    //alert(window.parent.innerWidth);
                    if (window.parent.EcpWebChatEntry != null) {
                   
                        if (!window.parent.EcpWebChatEntry.dvP4Page.disabled) {
                            window.parent.EcpWebChatEntry.OpenP4Page(url);
                        }
                        else {
                            if (window.parent.innerWidth <= '414') {
                                window.open(url)
                            }
                            else {
                                WebChat.OpenP4Page(url, 1);
                            }
                        }
                    }
                    else {
                        WebChat.OpenP4Page(url, 1);
                    }

                }
                content = optionlist;
               
                contentHtml = "<div class='ChatMessageContent ChatMessageTextContent"+ IW+ "'>" +
                               WebChat.processTextContent(content) +
                               "</div>";
            }

            else {
                if (type == Constant.TYPE_TEXT) {
                    contentHtml = "<div class='ChatMessageContent ChatMessageTextContent" + IW + "'>" +
                                WebChat.processTextContent(content) +
                                "</div>";
                }
                else if (type == Constant.TYPE_IMAGE) {
                    var iconClass = WebChat.getFileIconClass(content.name);
                    var url = content.thumbnailUrl || content.url;
                    var hasUrl = url != null;
                    contentHtml = "<div class='ChatMessageContent ChatMessageImageContent'>" +
                                "<img class=Image onclick=WebChat.doImageClick(event)" +
                                (hasUrl ? " src='" + url + "' url='" + content.url + "'" : "") +
                                ">" +
                                "<div class=ChatMessageImageContentMask></div>" +
                                "</div>";
                }
                else if (type == Constant.TYPE_FILE) {
                    var iconClass = WebChat.getFileIconClass(content.name);
                    var hasUrl = content.url != null;
                    contentHtml = "<div class='ChatMessageContent ChatMessageFileContent'>" +
                                "<div class=ChatMessageFileContentTop>" +
                                "<div class='" + iconClass + "'></div>" +
                                "<div class=ChatMessageFileContentName>" + content.name + "</div>" +
                                "<div class=ChatMessageFileContentInfo>" +
                                "<label class=ChatMessageFileContentSize>" +
                                Util.formatFileSize(content.size) +
                                "</label>" +
                                "<label class=ChatMessageFileContentStatus>" +
                                (hasUrl ? "" : WebChat.text("UploadStart")) +
                                "</label>" +
                                "</div>" +
                                "</div>" +
                                "<div class=ChatMessageFileContentBottom>" +
                                "<a class=Link target=_blank" + (hasUrl ? " href='" + content.url + "'" : "") + ">" +
                                WebChat.text("Download") +
                                "</a>" +
                                "</div>" +
                                "</div>";
                }
            }
            if (align == "Left" || (align == "Right" && WebChat.isInAgentService == true))
                var html = "<div class='ChatMessage ChatMessage" + align + "' id=" + id + ">"
                            + "<div class='ChatMessageAvatar ChatMessageAvatar" + senderClass + "'></div>"
                            + contentHtml
                            //+ "<div class=ChatMessageTime>" + time + "</div>"
                            + "</div>";

            $(html).appendTo(messageList);
        }
        messageList.scrollTop = messageList.scrollHeight;
        return id;
    },

    getTenantInfo: function () {
        var jdo = $.Deferred();
        WebChat.ajax({
            url: WebChat.CRMGatewayUrl + "openapi/web/ivr/tenantInfo",
            data: {
                _header_:
                    {
                        tokenId: "",
                        language: WebChat.language == null ? "zh-tw" : WebChat.language
                    }, 
                    tenantId: WebChat.tenantId
            },
            error:"TenantInfoErrorMessage",         
            success: function (ret) {
                WebChat.tenantInfo = ret.tenantInfo;
                //Util.log(JSON.stringify(WebChat.tenantInfo));
                jdo.resolve();
            }
        });
        return jdo.promise();
    },

    changeLoginform: function () {
        if (WebChat.tenantId=="ZH-CN")
        $("#loginFormId").attr("action", "https://account.asus.com.cn/signin.aspx");
        var lang = WebChat.tenantId.toLowerCase();
        var site = lang.split("-")[1];
        $("#lang").val(lang);
        $("#site").val(site);
    },

    getFileIconClass: function (fileName) {
        var map = {
            "Excel": /\.(xls|xlsx)$/i,
            "Exe": /\.(exe|bat|cmd|sh|msi)$/i,
            "Image": /\.(bmp|gif|jpg|jpeg|png)$/i,
            "Ppt": /\.(ppt|pptx)$/i,
            "Text": /\.(txt|log)$/i,
            "Word": /\.(doc|docx)$/i,
            "Zip": /\.(7z|cab|gz|iso|jar|rar|tar|z|zip)$/i
        };
        for (var key in map) {
            if (map[key].test(fileName)) {
                return "ChatMessageFileContentIcon ChatMessageFileContentIcon" + key;
            }
        }
        return "ChatMessageFileContentIcon";
    },

    //-----------------------------------------------------------------------
    // other methods
    //-----------------------------------------------------------------------

    ajax: function (settings) {

        var success = settings.success;
        var error = settings.error;
        var success = settings.success;

        if (typeof error == "string") {
            var errorCode = error;
            error = settings.error = function () {
                WebChat.addSystemMessage(WebChat.text(errorCode));
            }
        }
        if (typeof success == "string") {
            var successCode = success;
            success = settings.success = function () {
                WebChat.addSystemMessage(WebChat.text(successCode));
            }
        }
        if (settings.method == null) {
            settings.method = "POST";
        }

        if (typeof settings.data == "object") {
            settings.data = JSON.stringify(settings.data);
        }
        settings.success = function (result) {
            WebChat.processAjaxResult(result, success, error);
        };
        $.ajax(settings);
    },

    processAjaxResult: function (result, success, error) {
        if (result._header_ != null && !result._header_.success) {
            Util.log("AJAX failed.", result._header_.errorMessage, result._header_.stackTrace);
            if (error) {
                error(result._header_);
            }
        }
        else {
            if (success) {
                success(result);
            }
        }
    },

    showHint: function (key) {
        switch (key) {
            case "attention":
                $("#HintModalTitle").html(WebChat.text("AttentionButtonText"));
                break;
            case "help":
                $("#HintModalTitle").html(WebChat.text("HelpButtonText"));
                break;
            default:
                $("#HintModalTitle").html("");
        }

        $("#dvHintModalBody").html(WebChat.hintHtmlMap[key]);
        $("#HintModal").modal("show");
    },

    showSurvey: function () {
        if (WebChat.isEverInAgentService == true) {
            $("#SurveyAgentZone").css("display", "block");
        }
        $("#SurveyModal").modal("show");
    },

    processTextContent: function (text) {
        if (text == null) {
            text = "";
        }

        text = text.replace(/=[“]/g, "=\"").replace(/[”]]/g, "\"]")
                .replace(/^\s+|\s+$/g, "").replace(/\n/g, "").replace("<br><br><br>", "<br><br>").replace("</p><br><br>", "</p><br>")

                //action pattern
                .replace(/\[link\s+action=['"](\w+)['"]\]([^\[]+)\[\/link\]/g, "<label action=\"$1\" onclick=\"LinkAction.doClick(event);\">$2</label>")

                //message pattern
                .replace(/\[link\](.*?)\[\/link\]/gi, "<label action=\"SendMessage\" onclick=\"LinkAction.doSendMessage('$1');\">$1</label>")

                //submit pattern
                .replace(/\[link\s+submit=[\'\"]+([^\[\]\'\"]+)[\'\"]+\s*[^\[\]]*\]([^\[\]]+)\[\/link\]/gi, "<label action=\"SendMessage\" onclick=\"LinkAction.doSendMessage('$1');\">$2</label>")
                .replace(/\[link\s+submit=([^\s\[\]\'\"]+)\s*[^\[\]]*\]([^\[\]]+)\[\/link\]/gi, "<label action=\"SendMessage\" onclick=\"LinkAction.doSendMessage('$1');\">$2</label>")

                //url pattern
                .replace(/\[link\s+url=[\'\"]+([^\[\]\'\"]+)[\'\"]+\s*[^\[\]]*\]([^\[\]]+)\[\/link\]/gi, "<label action=\"OpenUrl\" onclick=\"LinkAction.doOpenUrl('$1');\">$2</label>")
                .replace(/\[link\s+url=([^\s\[\]\'\"]+)\s*[^\[\]]*\]([^\[\]]+)\[\/link\]/gi, "<label action=\"OpenUrl\" onclick=\"LinkAction.doOpenUrl('$1');\">$2</label>")
               // .replace(/(^|[^"'=])((http|https|ftp):\/\/([\w-]+\.)+[\w-]+([\w-.\/?=;!*%$]*)?([\w-&=;!*%$]*)?)/gi, "<label 3 action=\"OpenUrl\" onclick=\"LinkAction.doOpenUrl('$1');\">$2</label>")
               // .replace(/(http|ftp|https)_/gi, "<label  action=\"OpenUrl\" onclick=\"LinkAction.doOpenUrl('$1');\">$1</label>")

	            //P4 pattern
                .replace(/\[link\s+p4=[\'\"]+([^\[\]\'\"]+)[\'\"]+\s*[^\[\]]*\]([^\[\]]+)\[\/link\]/gi, "<label action=\"OpenUrl\" onclick=\"LinkAction.doOpenP4Url('$1');\">$2</label>")
                .replace(/\[link\s+p4=([^\s\[\]\'\"]+)\s*[^\[\]]*\]([^\[\]]+)\[\/link\]/gi, "<label action=\"OpenUrl\" onclick=\"LinkAction.doOpenP4Url('$1');\">$2</label>")

        //.replace(/\[link[^\]]*\]/g, "").replace(/\[\/link\]/g, "");

        return text;
    },

    isButtonEnabled: function (element) {
        var button = $(typeof element == "string" ? "#" + element : element);
        return !button.hasClass("ButtonDisabled");
    },

    refreshButtonStatus: function () {
        WebChat.resizeEditorWidth();
        if (WebChat.chatId == null) {
            $("#SendButton").unbind("click");
            $("#Editor").attr("disabled", "disabled");
            WebChat.doAgentButtonCklick = false;
            $("#lx-recommendation").removeClass("active");
            $('#Mail_modal').modal('hide');
            $('#Feedback_modal').modal('hide');
        }
        else {
            $("#SendButton").click(WebChat.doSendButtonClick);
            $("#Editor").removeAttr("disabled");
        }
        for (var id in WebChat.enableConditions) {
            if (eval(WebChat.enableConditions[id])) {
                $("#" + id).removeClass("ButtonDisabled");
            }
            else {
                $("#" + id).addClass("ButtonDisabled");
            }
        }
    },

    setMessageFailed: function (elementId, failed) {
        var elementJq = $("#" + elementId);
        if (failed || arguments.length == 1) {
            Util.log(elementJq.find(".ChatMessageIcon").isEmpty)
            if (elementJq.find(".ChatMessageIcon").length == 0) {
                var html = "<div class=ChatMessageIcon title='" + WebChat.text("MessageSendFailed") + "'>";
                $(html).insertAfter(elementJq.find(".ChatMessageAvatar"));
            }
            elementJq.addClass("ChatMessageFailed");
        }
        else {
            elementJq.removeClass("ChatMessageFailed");
        }
    },

    //-----------------------------------------------------------------------
    // websocket
    //-----------------------------------------------------------------------

    socketHandlers:
	{
	    "agent/ready": "doSocketAgentReady",
	    "agent/stop": "doSocketAgentStop",
	    "message/send": "doSocketMessageSend"
	},

    doSocketOpen: function () {
        Util.log('socket opened');
        var message = {
            type: Constant.TYPE_TEXT,
            content: WebChat.text("WebsocketSuccess")
        };
    },

    doSocketClose: function (reason) {
        Util.log('socket closed: ' + reason);
        //WebChat.addSystemMessageAsDialog(WebChat.text("WebsocketClosed"));
        WebChat.chatId = null;
    },

    doSocketError: function () {

        Util.log('web socket error');
        var message = {
            type: Constant.TYPE_TEXT,
            content: WebChat.text("WebsocketFailed")
        };
        WebChat.addMessage(message);
    },

    doSocketMessage: function (code, data) {
        var code = data._header_ && data._header_.code;
        Util.log("[websocket %s]", code, data);
        var handler = WebChat[WebChat.socketHandlers[code]];
        if (handler == null) {
            Util.log("unknown WebSocket data code: %s", code);
        }
        else {
            handler(data);
        }
    },

    doSocketAgentReady: function (data) {
        if (data.success) {
            WebChat.doAgentButtonCklick = true;
            WebChat.addMessage({ category: "cm", senderType: "agent", type: "Text", content: data.greeting });
            WebChat.isEverInAgentService = true;
            WebChat.asusChatId = data.asusChatId;
        }
        else {
            WebChat.addSystemMessage(data.errorMessage);
            WebChat.socket.close();
            WebChat.socket = null;
        }
        WebChat.isInAgentService = data.success;
        WebChat.refreshButtonStatus();
    },

    doSocketAgentStop: function (data) {
        console.log("doSocketAgentStop" + JSON.stringify(data));
        WebChat.addSystemMessage(data.description);
       
        WebChat.socket.close();
        WebChat.socket = null;
        WebChat.isInAgentService = false;
        WebChat.refreshButtonStatus();
        WebChat.doApplyAgentButtonClick = false;
    },

    doSocketMessageSend: function (data) {
        console.log(JSON.stringify(data));
        data.category = (data.category || Constant.CATEGORY_CHAT).toLowerCase();
        if (data.category == "am") {
            data.category = Constant.CATEGORY_CHAT;
        }
        if (data.category == Constant.CATEGORY_CHAT) {
            data.senderType = Constant.SENDER_TYPE_AGENT;
        }
        WebChat.addMessage(data);
    },

    //-----------------------------------------------------------------------
    // util methods
    //-----------------------------------------------------------------------
    text: function (code) {
        var text = WebChat.textResource[code] || code;
        for (var i = 1; i < arguments.length; ++i) {
            text = text.replace("${" + (i - 1) + "}", arguments[i]);
        }
        return text;
    }
};

//window.unload = window.onbeforeunload = WebChat.doBeforeUnload;
window.unload = window.onbeforeunload = WebChat.doBeforeUnload;

$(document).ready(function () {
    WebChat.doLoad();
    document.ondragover = function (e) { e.preventDefault(); e.returnValue = false; };
    document.ondrop = function (e) { e.preventDefault(); e.returnValue = false; };

    /*評分按鈕樣式*/  
    $('#feedback').on('click', function(){
        $('.modal-popup .pop-content ol li').removeClass('feedback-active');
        $(this).parent().addClass('feedback-active');
    }); 
    $('#feedback_2').on('click', function(){
        $('.modal-popup .pop-content ol li').removeClass('feedback-active');
        $(this).parent().addClass('feedback-active');
    }); 
});
