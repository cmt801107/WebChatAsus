//滿意度調查 
var Survey =
{  //滿意OR不滿意
    Questionnaire: function (score) {
        WebChat.Score = score;
        var data=""
        if (WebChat.Suggest == null)
            data = { q1: WebChat.Score, chatId: WebChat.asusChatId }
        else
            data = { q1: WebChat.Score, suggest: WebChat.Suggest, chatId: WebChat.asusChatId }

        $.ajax({
                 url:   WebChat.tenantInfo.chatServerHost.toLowerCase() + "/info/survey",
                 data: data,
                 type: 'get',
                 dataType: "xml",
                 cache : false,
                 success: function(data){
                     var ResultCode = $(data).find("ResultCode").text();
                     if(score=='2')
                          $("#lx-recommendation").removeClass("active");
                 }
             });    
         return false;
     },

    Mail: function () {
        WebChat.Suggest = $('#sentmail').val();
        var data = "" ;
        if (WebChat.Score == null)
            data = { suggest: WebChat.Suggest, chatId: WebChat.asusChatId };
        else
            data = { q1: WebChat.Score, suggest: WebChat.Suggest, chatId: WebChat.asusChatId }

         $.ajax({
             url: WebChat.tenantInfo.chatServerHost.toLowerCase() + "/info/survey",
             data: data,
             type: 'get',
             dataType: "xml",
             cache: false,
             success: function (data) {
                 var ResultCode = $(data).find("ResultCode").text();
                 $('#sentmail').val('');
             }
         });
     },

     Feedback: function () {
         $.ajax({
             url: WebChat.tenantInfo.chatServerHost.toLowerCase() + "/info/survey",
             data: { suggest: '', chatId: WebChat.asusChatId, q1: '1', q2: '', q3: $('input[name=q3]:checked').val() },
             type: 'get',
             dataType: "xml",
             cache : false,
             success: function(data){
                 var ResultCode = $(data).find("ResultCode").text();             }
         });
     }

};
