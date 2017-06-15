//檔案上傳
var File =
    {
        initialize: function () {
            $("#fileupload").fileupload({
                url: WebChat.CRMGatewayUrl + "openapi/web/file/upload",
                submit: File.doFileSubmit,
                progress: File.doFileUploadProgress,
                done: File.doFileUploadSuccess,
                fail: File.doFileUploadError
            });

            $("#imageupload").fileupload({
                url: WebChat.CRMGatewayUrl + "openapi/web/file/upload",
                formData: { args: JSON.stringify({ isImage: true }) },
                maxFileSize: 2 * 1024 * 1024,
                acceptFileTypes: /(\.|\/)(gif|jpe?g|png|tif|bmp)$/i,
                submit: File.doImageSubmit,
                done: File.doImageUploadSuccess,
                fail: File.doImageUploadError
            });
        },
        
        doFileSubmit: function (event, data) {
            var file = data.files[0];

            var message = {
                type: Constant.TYPE_FILE,
                content: { name: file.name, size: file.size }
            };
                var elementId = WebChat.addMessage(message);
                this.messageInfo = { elementId: elementId, message: message };
            },
         
        
        doFileUploadProgress: function (event, data) {
       
                var percent = parseInt(data.loaded / data.total * 100, 10);
                var parent = "#" + this.messageInfo.elementId;
                $(".ChatMessageFileContentStatus", parent).text(WebChat.text("UploadProgress", percent));
            
        },
        
        doFileUploadSuccess: function (event, data) {
      
                var info = this.messageInfo;
                var parent = "#" + info.elementId;
                WebChat.processAjaxResult(data.result,
                    function () {
                        $(".ChatMessageFileContentStatus", parent).text(WebChat.text("UploadSuccess"));
                        $(".Link", parent).attr("href", data.result.url);
                        info.message.content.url = data.result.url;
                        info.message.content.asusUrl = data.result.asusUrl;
                        WebChat.sendMessage(info.message, info.elementId);
                    },
                    function () {
                        $(".ChatMessageFileContentStatus", parent).text(WebChat.text("UploadError"));
                    }
                    );
            
        },
        
        doFileUploadError: function (event, data) {
            var parent = "#" + this.messageInfo.elementId;
            $(".ChatMessageFileContentStatus", parent).text(WebChat.text("UploadError"));
        },
        
        doImageSubmit: function (event, data) {
            var file = data.files[0];    
                var message = {
                    type: Constant.TYPE_IMAGE,
                    content: { name: file.name, size: file.size }
                };
                var elementId = WebChat.addMessage(message);
                this.messageInfo = { elementId: elementId, message: message };
                $("img", "#" + elementId).attr("src", URL.createObjectURL(file));
        },
        
        doImageUploadSuccess: function (event, data) {
            var info = this.messageInfo;
            var parent = "#" + info.elementId;
            WebChat.processAjaxResult(data.result,
                function () {
                    $(".Image", parent).attr("url", data.result.url);
                    info.message.content.url = data.result.url;
                    if (data.result.thumbnailUrl != null) {
                        info.message.content.thumbnailUrl = data.result.thumbnailUrl;
                        info.message.content.asusUrl = data.result.asusUrl;
                    }
                    WebChat.sendMessage(info.message, info.elementId);
                },
                function () {
                    WebChat.setMessageFailed(info.elementId, true);
                }
                );
        },
        
        doImageUploadError: function (event, data) {
            WebChat.setMessageFailed(this.messageInfo.elementId, true);
        }
    };

$(File.initialize);