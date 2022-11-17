/* lib-rest.js */
$$.REST = {
    _csrfHeaderId : "#context.security.csrf.header#",
    Call : function(args) {
        /* Example args
         * {
         *     "method" : "POST",
         *     "url" : "/api/v1/resources",
         *     "headers" : null,
         *     "success" : function(response, body) {      
         *     },
         *     "error" : function(response) {
         *     },
         *     "retryCount" : 2,
         *     "body" : {
         *         "property" : "value",
         *         "flag" : true
         *     },
         *     "spinnerDelay" : 2500,
         *     "suppressWarnings" : false,
         * }
        */
        
        var _handleError = function(args, error) {
            $$.Banner.ShowMessages({ 
                "category" : "Application", 
                "severity" : "Error", 
                "number" : 1
            });
        };
        
        var _handleResponse = function(args, response) {
            $$.Timers.Session.Reset();
            if (response.redirected) {
                var url = response.url; 
                if (response.url == null || response.url.trim() == "") {
                    url = "/";
                }
                $$.URL.Go(url);
                return false;
            }
            
            switch (response.status) {
                case 200:
                case 201:
                case 202:
                    var isJson = response.headers.get("content-type") != null && response.headers.get("content-type").indexOf("application/json") !== -1;
                    if (isJson) {
                        return response.json().then(function(body) {
                            if (response.status == 202 && Array.isArray(body.messages) && args.suppressWarnings !== true) {
                                $$.Banner.ShowMessages(body.messages);
                            }
                            
                            if (typeof(args.success) === "function") {
                                args.success(response, body.body != null ? body.body : body);
                            }
                        });
                    }

                    return response.text().then(function(body) {
                        if (typeof(args.success) === "function") {
                            args.success(response, body);
                        }
                    });
                case 204:
                    if (typeof(args.success) === "function") {
                        args.success(response, null);
                    }
                    return true;
                case 422:
                    response.json().then(function(body) {
                        if (typeof(args.error) === "function" && args.error(response, body)) {
	                        return false;
	                    }
	                    
                        if (body != null && Array.isArray(body.messages)) {
                            $$.Banner.ShowMessages(body.messages);
                        }
                    });
                    return false;
                default:
                    if (typeof(args.error) === "function" && args.error(response)) {
                        return false;
                    }
                    _handleError(args, response);
                    return false;
            }
        };
        
        var _call = function(args, count) {
            $$._inProgress.Add();
            $$.UI.Spinner.Delay(isNaN(args.spinnerDelay) ? 2500 : args.spinnerDelay);
            
            if (isNaN(count) || count < 1) {
                count = 1;
            }
            
            var isCor = args.url.startsWith("http") && !args.url.startsWith($$.URL.GetDomain());
            
            var opts = {
                "method" : args.method,
                "headers" : args.headers,
                "credentials" : "same-origin"
            };
            
            if (opts.headers == null) {
                switch (opts.method) {
                    case "GET":
                        opts.headers = {
                            "Accept" : "*/*"
                        };
                        break;
                    case "POST":
                    case "PUT":
                        opts.headers = {
                            "Content-type" : "application/json"
                        };
                        break;
                    case "PATCH":
                        opts.headers = {
                            "Content-type" : "text/plain"
                        };
                        break;
                    default:
                        opts.headers = {};
                        break;
                }
            }
            
            if (args.body != null) {
                if (opts.headers["Content-type"] === "application/json") {
                    opts.body = JSON.stringify(args.body);
                } else {
                    opts.body = args.body;
                }
            }
            
            if (isCor !== true) {
                var csrfToken = $$.Cookies.Read($$.REST._csrfHeaderId);
                if (csrfToken != null) {
                    opts.headers[$$.REST._csrfHeaderId] = csrfToken;
                }
            }
            
            fetch(args.url, opts).then(function(response) {
                var _csrfMismatch = function(headers) {
                    var cookie = $$.Cookies.Read($$.REST._csrfHeaderId);
                    if (cookie == null) {
                        return false;
                    }
                    return opts.headers[$$.REST._csrfHeaderId] != cookie;
                };
                
                if (response.status === 403 && _csrfMismatch(opts.headers)) {
                    var maxTries = isNaN(args.retryCount) || args.retryCount < 1 ? 2 : args.retryCount;
                    if (count < maxTries) {
                        setTimeout(function() { _call(args, count + 1); }, 1);
                    } else {
                        _handleError(args, response);
                    }
                    $$._inProgress.Complete();
                    $$.UI.Spinner.Hide();
                    return;
                }
                
                _handleResponse(args, response);
                
                $$._inProgress.Complete();
                $$.UI.Spinner.Hide();
            }).catch(function(error) {
                if (typeof(args.error) === "function" && args.error(error)) {
                    return;
                }
				_handleError(args, error);
                $$._inProgress.Complete();
                $$.UI.Spinner.Hide();
            });
        };
        _call(args);
    }
};
