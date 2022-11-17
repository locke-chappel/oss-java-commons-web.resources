/* lib-l10n.js */
$$.L10N = {
    _inProgress : {},
    _cache : {},
    _url : function() {
        var locale = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);
        if (locale == null || locale.trim() == "") {
            locale = "en";
        }
        return "/l10n/" + locale.trim() + "/";
    },
    Get : function(ids, callback, values){
        var _load = function(id, callback, values) {
            if ($$.L10N._inProgress.hasOwnProperty[id] && $$.L10N._inProgress[id] === true) {
                setTimeout(function() {
                    _load(id, callback, values);
                }, 10);
                return;
            }
            
            if (typeof($$.L10N._cache[id]) === "undefined") {
                $$.L10N._inProgress[id] = true;
                $$.REST.Call({
                   "method" : "GET",
                   "url" : $$.L10N._url() + id,
                   "success" : function(response, body) {
                       $$.ForEach(body, function(value, key) {
                           $$.L10N._cache[key] = value;
                       });
                       
                       delete $$.L10N._inProgress[id];
                       
                       if (typeof(callback) === "function") {
                           callback($$.L10N.Replace($$.L10N._cache[id], values));
                       }
                   },
                   "error" : function(response) {
                       callback("Unable to resolve " + id);
                       return true;
                   }
                });
            } else if (typeof(callback) === "function"){
                callback($$.L10N.Replace($$.L10N._cache[id], values));
            }
        };
        
        var toLoad = ids;
        if (!Array.isArray(ids)) {
            toLoad = [ ids ];
        }
        
        var texts = {};
        for (var i = 0; i < toLoad.length; i++) {
            texts[toLoad[i]] = false;
            (function(id) {
                _load(id, function(text) {
                    texts[id] = text;
                }, values);
            })(toLoad[i]);
        }
        
        var _check = function() {
            if (typeof(callback) === "function") {
                var inProgress = false;
                $$.ForEach(texts, function(value, key){
                    if (value === false) {
                        inProgress = true;
                        return true;
                    }
                });
                
                
                if (inProgress) {
                    setTimeout(_check, 10);
                } else {
                    if (toLoad.length == 1) {
                        callback(texts[toLoad[0]]);
                    } else {
                        callback(texts);
                    }
                }
            }
        };
        _check();
    },
    Replace : function(text, values) {
        if (typeof(text) !== "string") {
            return text;
        }
        
        if (typeof(values) !== "object") {
            return text;
        }
        
        var t = text;
        $$.ForEach(values, function(value, key){
            t = t.replace("%" + key + "%", value);
        });
        return t;
    }
};
