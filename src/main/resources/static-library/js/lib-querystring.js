/* lib-querystring.js */
$$.QueryString = {
    _originalURL : null,
    _values : null,
    Load : function() {
        if ($$.QueryString._values == null) {
            $$.QueryString._values = new URLSearchParams(window.location.search);
        }
        var url = window.location.toString();
        $$.QueryString._originalURL = url;
        if (url.indexOf("?") > 0) {
            url = url.substring(0, url.indexOf("?"));
            window.history.replaceState({}, document.title, url);
        }
    },
    Read : function(key) {
        if ($$.QueryString._values == null) {
            $$.QueryString._values = new URLSearchParams(window.location.search);
        }
        return $$.QueryString._values.get(key);
    },
    OriginalURL : function() {
        return $$.QueryString._originalURL;
    }
};

$$.Init.Add($$.QueryString.Load);
