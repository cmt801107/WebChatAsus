//¤½¥Î¨ç¦¡
var Util =
{
    formatDate: function (value, format) {
        if (value.constructor.toString() != Date.toString()) {
            return null;
        }
        if (format == null) {
            format = "yyyy-MM-dd HH:mm:ss";
        }
        var y = value.getFullYear();
        var m = value.getMonth() + 1;
        var d = value.getDate();
        var h = value.getHours();
        var n = value.getMinutes();
        var s = value.getSeconds();
        var w = value.getDay();
        return format.replace("yyyy", y).replace("yy", y % 100 < 10 ? "0" + y % 100 : y % 100)
					 .replace("MM", m < 10 ? "0" + m : m).replace("M", m)
					 .replace("dd", d < 10 ? "0" + d : d).replace("d", d)
					 .replace("HH", h < 10 ? "0" + h : h).replace("H", h)
					 .replace("mm", n < 10 ? "0" + n : n).replace("m", n)
					 .replace("ss", s < 10 ? "0" + s : s).replace("s", s);
    },

    formatNumber: function (value, format) {
        if (format == null) {
            return value.toString();
        }
        var buffer = [];
        var head = format.match(/[,0]*(?:\.|$)/)[0].replace(/[,\.]/g, "").length;
        var tail = format.match(/\.0*|$/)[0].replace(/\./, "").length;
        var group = format.match(/,[0#]*(?:\.|$)|$/)[0].replace(/[,\.]/g, "").length;
        var flag = value < 0 ? "-" : "";
        value = Math.round(Math.abs(value) * Math.pow(10, tail));
        for (var i = 0; i < tail; ++i, value = Math.floor(value / 10)) {
            buffer.push(value % 10);
        }
        if (tail > 0) {
            buffer.push(".");
        }
        for (var i = 0; i < head || value > 0; ++i, value = Math.floor(value / 10)) {
            buffer.push((value % 10) + (i > 0 && i % group == 0 ? "," : ""));
        }
        return flag + buffer.reverse().join("");
    },

    formatFileSize: function (size, removeRedundantZeros) {
        if (size == null) {
            return "";
        }
        var units = ["B", "KB", "MB", "GB", "TB", "PB"];
        removeRedundantZeros = removeRedundantZeros != false;
        for (var i = 0; i < units.length; ++i) {
            if (size < 10) {
                var s = Util.formatNumber(size, "0.00");
                return (removeRedundantZeros ? s.replace(/\.00/, "") : s) + " " + units[i];
            }
            else if (size < 100) {
                var s = Util.formatNumber(size, "0.0");
                return (removeRedundantZeros ? s.replace(/\.0/, "") : s) + " " + units[i];
            }
            else if (size < 1000 || i == units.length - 1) {
                return Util.formatNumber(size, "0") + " " + units[i];
            }
            else {
                size = size / 1024;
            }
        }
    },

    upperFirstLetter: function (s) {
        return s == null || s.length == 0 ? s : s.substring(0, 1).toUpperCase() + s.substring(1);
    },

    isEmpty: function (s) {
        return s == null || s.trim().length == 0;
    },

    isUndefined: function (s) {
        return s == null || typeof s !== "undefined" && s != ""
    },

    escapeHtml: function (s) {
        if (s == null) {
            return "";
        }
        if (typeof (s) != "string") {
            s = s + "";
        }
        return s.replace(/&/g, "&amp;")
			.replace(/\>/g, "&gt;")
			.replace(/\</g, "&lt;")
			.replace(/\'/g, "&#39;")
			.replace(/\"/g, "&quot;")
			.replace(/\n/g, "");
    },

    unescapeHtml: function (s) {
        if (s == null) {
            return null;
        }
        return s.replace(/<br[^>]*>/g, "\n")
			.replace(/<[^>]*>/g, "")
			.replace(/&gt;/g, ">")
			.replace(/&lt;/g, "<")
			.replace(/&#39;/g, "'")
			.replace(/&quot;/g, "\"")
			.replace(/^\s+|\s+$/g, "");
    },

    log: function () {
        if (window.console) {
            // Only run on the first time through - reset this function to the appropriate Util.log helper
            if (Function.prototype.bind) {
                log = Function.prototype.bind.call(Util.log, console);
            }
            else {
                log = function () {
                    Function.prototype.apply.call(Util.log, console, arguments);
                };
            }
            log.apply(this, arguments);
        }
    },

    getParameterByName: function (name) {
        url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    },

    getCookie: function (name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }
};
