/* lib-cookies.js */
$$.Cookies = {
    _prefix : "#context.cookies.prefix#",
    Read : function(name) {
        var s = document.cookie;
        if (s == null || name == null || name == "") {
            return null;
        }
        var value = s.match(new RegExp($$.Cookies._prefix + name + "=([^;]*)"));
        return value == null ? null : decodeURIComponent(value[1]);
    }
};
