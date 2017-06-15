var EcpWebChatEntry =
{
    SmartAgentUrl: "index.html", //example => https://qbi.chainsea.com.tw/index.html
    SmartAgentQueryString: "",
    Icon: "image/ChainseaQbi.png",
    Title: "智能客服",

    dvSmartAgentICON: null,
    dvSmartAgentMainFrm: null,
    dvSABody: null,
    ifMain: null,
    ifLoaded: false,

    dvP4Page: null,
    ifP4Url: null,

    Initialize: function () {
        EcpWebChatEntry.SmartAgentQueryString = "?fromTitle=" + EcpWebChatEntry.getFromTitle() +
                                                "&fromDevice=" + EcpWebChatEntry.getFromDevice() +
                                                "&fromUrl=" + EcpWebChatEntry.getFromUrl();

        EcpWebChatEntry.CreateStyles();
        EcpWebChatEntry.CreateFrame();

        EcpWebChatEntry.dvSmartAgentMainFrm = document.getElementById("dvSmartAgentMainFrm");
        EcpWebChatEntry.ifMain = document.getElementById("ifMain");
        EcpWebChatEntry.dvSABody = document.getElementById("dvSABody");
        EcpWebChatEntry.dvSmartAgentICON = document.getElementById("dvSmartAgentICON");

        EcpWebChatEntry.dvP4Page = document.getElementById("dvP4Page");
        EcpWebChatEntry.ifP4Url = document.getElementById("ifP4Url");

        EcpWebChatEntry.dvP4Page.disabled = false;
        EcpWebChatEntry.OpenPanel();
        EcpWebChatEntry.dvSmartAgentICON.addEventListener("click", function () {
            EcpWebChatEntry.OpenPanel();
        });

        document.getElementById("btnP4PageClose").addEventListener("click", function () {
            EcpWebChatEntry.CloseP4Page();
        });

        window.addEventListener('resize', function () {
            EcpWebChatEntry.Resize();
        });

    },

    CreateFrame: function () {

        var sPanelHtml = "<div id=\"dvSmartAgentICON\">" +
                        "    <div id=\"dvICON\"><img id=\"imgICON\" src=\"" + EcpWebChatEntry.Icon + "\" /></div>" +
                        "    <div id=\"dvICONTitle\">" + EcpWebChatEntry.Title + "</div>" +
                        "</div>" +
                        "<div id=\"dvSmartAgentMainFrm\">" +
                        "    <div id=\"dvSABody\"><iframe id=\"ifMain\" src=\"\"></iframe></div>" +
                        "</div>" +
                        "<div id=\"dvP4Page\">" +
                        " <div id=\"dvP4PageTitle\"><span id=\"btnP4PageClose\">X</span>&nbsp;</div>" +
                        "<iframe id=\"ifP4Url\" src=\"\"></iframe>" +
                        "</div>";

        var Panel = document.createElement("div");
        Panel.id = "dvSmartAgent";
        Panel.innerHTML = sPanelHtml;
        Panel.onmousewheel = function (event) { event.preventDefault(); };
        document.body.appendChild(Panel);
    },

    CreateStyles: function () {
        var sStyles = "";

        var css = document.createElement('style');
        css.type = 'text/css';

        sStyles = "#dvSmartAgentICON {    " +
                "    position: fixed;   " +
                "    right: 10px;       " +
                "    bottom: 30px;      " +
                "    width: 140px;      " +
                "    height: 200px;     " +
                "    cursor: pointer;   " +
                "}                      " +
                "#dvSmartAgentICON div {" +
                "    display:inline-block;" +
                "}                      " +
                "#dvICON {              " +
                "    width: 100%;       " +
                "    height: 163px;     " +
                "}                      " +
                "#dvICONTitle {         " +
                "    width: 100%;       " +
                "    text-align:center;" +
                "}                      " +
                "#imgICON {             " +
                "    width: 100%;       " +
                "}                      " +
                "#dvSmartAgentMainFrm { " +
                "    position: absolute;" +
                "    background-color: azure;" +
                "    display: none;     " +
                "    margin: 0px;       " +
                "    border: 1px solid #B4B4B4;" +
                "    box-shadow: rgba(0, 0, 0, 0.15) -8px 10px 15px 0;" +
                "    overflow: hidden;  " +
                "}                      " +
                "#dvSABody {            " +
                "    width: 100%;       " +
                "    height: 100%;      " +
                "    border: 0px;       " +
                "}                      " +
                "#ifMain {              " +
                "    width: 100%;       " +
                "    height: 100%;      " +
                "    border: 0px;       " +
                "}                      " +
                "#dvP4Page {            " +
                "    background-color: white;" +
                //"    opacity: 0.9;      " + 
                "    display: none;     " +
                "    left: 380px;         " +
                "    top: 0px;          " +
                "    bottom: 0px;       " +
                "    right: 0px;      " +
                "    margin: 0px 0px 0px 0px;" +
                "    position: absolute;" +
                "}                      " +
                "#ifP4Url {             " +
                "    border: 0px;       " +
                "    display: block;    " +
                "    width: 98%;        " +
                "    height: 95%;       " +
                "    margin: 0 auto;    " +
                "}                      " +
                "#dvP4PageTitle {       " +
                "    display: block;    " +
                "    color: #ffffff;    " +
                "    width: 100%;       " +
                "    height: 30px;      " +
                "    text-align: right; " +
                "    font-size: 28px;   " +
                "    font-family: Arial;" +
                "}                      " +
                "#btnP4PageClose {      " +
                "    color: black;      " +
                "    cursor: pointer;   " +
                "}                      ";

        if (css.styleSheet) {
            css.styleSheet.cssText = sStyles;
        }
        else {
            css.appendChild(document.createTextNode(sStyles));
        }

        document.getElementsByTagName("head")[0].appendChild(css);
    },

    OpenPanel: function () {
        //alert('1 '+window.innerWidth);
        EcpWebChatEntry.dvSmartAgentMainFrm.style.width = window.innerWidth <= 512 ? window.innerWidth + "px" : "380px";
        EcpWebChatEntry.dvP4Page.disabled = window.innerWidth < 1024 ? true : false;

        //EcpWebChatEntry.dvSmartAgentMainFrm.style.height = window.innerHeight + "px";
        EcpWebChatEntry.dvSmartAgentMainFrm.style.top = "0px";
        EcpWebChatEntry.dvSmartAgentMainFrm.style.left = "0px";
        EcpWebChatEntry.dvSmartAgentMainFrm.style.bottom = "0px";

        //EcpWebChatEntry.dvSABody.style.height = EcpWebChatEntry.dvSmartAgentMainFrm.style.height;

        EcpWebChatEntry.dvSmartAgentMainFrm.style.display = "block";
        EcpWebChatEntry.dvSmartAgentICON.style.display = "none";

        if (!EcpWebChatEntry.ifLoaded) {
            EcpWebChatEntry.ifMain.src = EcpWebChatEntry.SmartAgentUrl + EcpWebChatEntry.SmartAgentQueryString;
            EcpWebChatEntry.ifLoaded = true;
        }
    },

    ClosePanel: function () {
        EcpWebChatEntry.dvSmartAgentMainFrm.style.display = "none";
        EcpWebChatEntry.dvSmartAgentICON.style.display = "block";
    },

    Resize: function () {

        EcpWebChatEntry.dvSmartAgentMainFrm.style.width = window.innerWidth <= 512 ? window.innerWidth + "px" : "380px";
        EcpWebChatEntry.dvP4Page.disabled = window.innerWidth < 1024 ? true : false;
        if (window.innerWidth <= 512) {
            $('#imgP4').css("display", "none");
        }
        else
            $('#imgP4').css("display", "block");
    },

    OpenP4Page: function (url) {
            EcpWebChatEntry.ifP4Url.src = url;
            EcpWebChatEntry.dvP4Page.style.display = "block";
        },

    CloseP4Page: function () {
        EcpWebChatEntry.ifP4Url.src = "";
        EcpWebChatEntry.dvP4Page.style.display = "none";
    },

    getFromTitle: function () {
        var fromTitle = "No Title";
        if (typeof (document.getElementsByTagName("title")[0]) !== 'undefined') {
            fromTitle = document.getElementsByTagName("title")[0].innerHTML;
        }
        return encodeURIComponent(fromTitle);
    },

    getFromDevice: function () {
        var fromDevice = "";;
        if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
            fromDevice = "MOBILE_APP";
        } else {
            fromDevice = "WEB_SITE";
        }
        return fromDevice;
    },

    getFromUrl: function () {
        var url = location.href,
 			protocol = location.protocol,
 			hostname = location.hostname,
 			pathname = location.pathname,
 			search = location.search;
        if (search) {
            search = search.replace(/</g, "");
            search = search.replace(/%3C/g, "");
            search = search.replace(/>/g, "");
            search = search.replace(/%3E/g, "");
            search = search.replace(/'/g, "");
            search = search.replace(/%27/g, "");
            search = search.replace(/"/g, "");
            search = search.replace(/%22/g, "");
            search = search.replace(/\//g, "");
            return protocol + "//" + hostname + pathname + search;
        } else {
            return url;
        }
    }
};

EcpWebChatEntry.Initialize();
