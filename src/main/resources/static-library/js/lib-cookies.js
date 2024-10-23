/* lib-cookies.js */
$$.Cookies = {
    _prefix : "#context.cookies.prefix#",
    Read : function(name) {
        var jar = document.cookie;
        var cName = $$.Text.Trim(name, true);
        if (jar == null || cName == null) {
            return null;
        }
        var value = jar.match(new RegExp($$.Cookies._prefix + cName + "=([^;]*)"));
        return value == null ? null : decodeURIComponent(value[1]);
    }
};
