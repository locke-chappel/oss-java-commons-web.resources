/* lib-url.js */
$$.URL = {
    GetDomain : function(url) {
        var u = typeof(url) === "string" ? url : window.location.href;
        var parts = u.split("/");
        return parts[0] + "//" + parts[2];
    },
    Go : function(to, from) {
        if (from != null) {
            window.history.replaceState({}, document.title, $$.URL.Resolve(from));
        }
        window.location.assign($$.URL.Resolve(to));
    },
    IsCurrent : function(url) {
        var find = $$.URL.Resolve(url);
        var current = window.location.href;
        if (!find.includes("?") && current.includes("?")) {
            current = current.substring(0, current.indexOf("?"));
        }
        if (find.startsWith("http")) {
            return find === current;
        }
        current = current.replace($$.URL.GetDomain(current), "");
        return find === current;
    },
    NewWindow : function(url, data) {
        var location = $$.URL.Resolve(url);
        var w = window.open();
        if (w == null) {
            $$.Banner.ShowMessage("error", "Unable to open URL in new window.");
            return;
        }
        
        if (data == null) {
            w.opener = null;
        } else {
            var domain = $$.URL.GetDomain(location);
            var _loaded = function(event) {
                if (event.origin !== domain && event.data === "ready") {
                    return;
                }
                w.postMessage(data, domain);
                $$.Events.Remove(window, "message", _loaded);
            };
            
            $$.Events.Add(window, "message", _loaded);
        }
        
        w.location.assign(location);
    },
    ReceiveMessage : function(origin, callback) {
        if (window.opener != null) {
            var domain = $$.URL.GetDomain(origin);
            window.opener.postMessage("ready", domain);

            var _listener = function(event) {
                if (event.origin === origin) {
                    if (typeof(callback) === "function") {
                        callback(event.data, event);
                    }
                    $$.Events.Remove(window, "message", _listener);
                }
            };
            
            $$.Events.Add(window, "message", _listener);
        }
    },
    Resolve : function(path) {
        if (path == null) {
            return null;
        }
        
        if (path.startsWith("http") || path.startsWith("mailto")) {
            return path;
        }
        
        var p = path;
        if (p[0] == "/") {
            p = p.substr(1);
        }
        return "#context.path.url#" + p;
    },
    ToParam : function(key, value, queryString) {
        if ($$.Text.Trim(key, true) == null || $$.Text.Trim(value, true) == null) {
            return $$.Text.Trim(queryString, true) == null ? "" : queryString;
        }
        
        var q = queryString;
        if ($$.Text.Trim(q, true) == null) {
            q = "?";
        } else {
            q += "&";
        }
        
        return q + key + "=" + encodeURIComponent(value.toString());
    }
};
