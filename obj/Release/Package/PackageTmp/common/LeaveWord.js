//留言
var LeaveWord =
    {
        postMethod: "Ecp.ServiceRequest.Save.data?=",
		postPayload: "{\"data\":[{\"FName\":\"ICR線上流留言\",\"FContactId\":\"9d415f07-78d9-4407-adbb-5e2809e7b093\",\"FEmail\":\"joyce.cai@chainsea.com.tw\",\"ULogFrom\":\"IVR\",\"FDescription\":\"姓名:{FName}, <BR>性別:{FGender},<BR>電子郵件:{FEmail},<BR>行動電話:{FPhone},<BR>問題類別:{FQuestion},<BR>留言:{FMsgContent},<BR>可回復時間:{FDatetime1}~{FDatetime2}\"}]} ",
        //postPayload: "{\"email\":{\"FId\":\"9ad436b4-dc9a-4296-8a53-db3042241a8f\",\"FTo\":\"{Fto}\",\"FToUnitId\":null,\"FToSchemaId\":null,\"FCc\":null,\"FBcc\":null,\"FSubject\":\"{FSubject}\",\"FContent\":\"<p>{FContent}</p>\",\"FSeparate\":false,\"FTimed\":false,\"FScheduleTime\":null}}",
        //mailReceiver: "digital@cathaybk.com.tw,polomi@cathaybk.com.tw,service@cathaybk.com.tw",
        //mailReceiver: "henry.chou@chainsea.com.tw;claire.chen@chainsea.com.tw;joe.lin@chainsea.com.tw",
        mailReceiver: "joyce.cai@chainsea.com.tw",
        
        show: function (items) {
            //$("#LeaveWord").css("display", "block");
            $("#LeaveWordModal").modal("show");
        },
        
        close: function (items) {
            //$("#LeaveWord").css("display", "none");
            $("#LeaveWordModal").modal("hide");
        },
        
        send: function () {
            var subject = "";
            var content = "";            
            var mailto = "";
            
            var postPayload = "";
            
            var name = "";
            var gender = "";
            var card = "";
            var email = "";
            var phone = "";
            var question = "";
            var msgContent = "";
			var date = "";
            
            name = $("#name").val();
           // gender = $("input[name=gender]:checked", "#messageForm").val(),
		    gender =$("input[name='gender']:checked").next("label").text();  
            //card = $("#card").val();
            email = $("#email").val();
            phone = $("#phone").val();
            //question = $("#question").find(":selected").val();
			question = $("#question").find("option:selected").text();
            msgContent = $("#msgContent").val();
			datetime1 = $("#datetime1").val();
			datetime2 = $("#datetime2").val();
            
            if ((name.length > 0) && (email.length > 0) && (phone.length > 0) && (msgContent.length > 0)) {
                //{Fto} : Mail to
                //{FSubject} : Subject
                //{FContent} : Content
                subject = "華碩支援服務 線上客服櫃台 - 留言表單(請勿直接回覆)";
                mailto = LeaveWord.mailReceiver;
                content = "名稱 : " + name + "</br>" +
               // "身分證字號 : " + card + "</br>" +
                "email : " + email + "</br>" +
                "留言內容 : " + msgContent + "</br>";
                
                postPayload = LeaveWord.postPayload.replace("{Fto}", mailto)
                            .replace("{FSubject}", subject)
                            .replace("{FContent}", content)
							.replace("{FName}", name)
							.replace("{FGender}", gender)
							.replace("{FEmail}", email)
							.replace("{FPhone}", phone)
							.replace("{FQuestion}", question)
							.replace("{FMsgContent}", msgContent)
							.replace("{FDatetime1}", datetime1)
							.replace("{FDatetime2}", datetime2);
                //alert(postPayload);

                WebChat.ajax({
                    url: WebChat.ECPUrl + LeaveWord.postMethod,
                    data: postPayload,
                    beforeSend: function (request) {
                        Util.log(JSON.stringify(request));
                        request.setRequestHeader("Accept-Language", "zh-tw");
                        request.setRequestHeader("Content-Type", "application/json");
                        request.setRequestHeader("Authorization", "Authorization: Basic YWRtaW5pc3RyYXRvcjoxMTExMTE=");
                    },
                    error: function () { 
                        //To Do
                    },
                    success: function (result) {
                        //alert(JSON.stringify(result));
                        Util.log(JSON.stringify(postPayload));
                        $("#msgTip").html("留言發送成功");                        
                    }
                });
                
            }
            else {
                alert("請填寫必填訊息後，再次點擊留言按鈕，謝謝。");
            }
        }
    };
