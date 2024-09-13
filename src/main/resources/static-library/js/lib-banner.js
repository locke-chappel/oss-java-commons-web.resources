/* lib-banner.js */
$$.Banner = {
    Config : {
        AutoHideAll : false,
        AutoHideTimeout : 5 * 1000,
        BannerId : "lib.notitifcations.banner"
    },
    Clear : function(types) {
        var banner = $$.Find($$.Banner.Config.BannerId);
        if (banner == null) {
            return;
        }
        
        if (types == null) {
            $$.Clear(banner);
        } else {
            var toClear = null;
            if (typeof(types) === "string") {
                toClear = [ types ];
            } else if (Array.isArray(types)) {
                toClear = types;
            }
            
            $$.ForEach(toClear, function(type) {
                var messages = banner.querySelectorAll("div.message." + type);
                $$.ForEach(messages, function(message) {
                    banner.removeChild(message);
                });
            });
        }
        
        if (banner.children.length < 1) {
            banner.classList.remove("show");
        }
    },
    Hide : function(message) {
        var banner = message.parentNode;
        if (banner == null) {
            return;
        }
        
        banner.removeChild(message);
        if (banner.children.length < 1) {
            banner.classList.remove("show");
        }
    },
    ShowMessage : function(type, text, autohide) {
        var aHide = typeof(autohide) === "boolean" ? autohide : type.toLowerCase() === "success"; 
        var _autoHide = function(message, timeout) {
            var _hide = function() {
                $$.Banner.Hide(message);
            };
            
            message.Timer = setTimeout(_hide, timeout);
            $$.Events.Add(message, "mouseover", function(event) {
                clearTimeout(message.Timer);
            });
            $$.Events.Add(message, "mouseout", function(event) {
                message.Timer = setTimeout(_hide, timeout);
            });
        };
        
        var banner = $$.Find($$.Banner.Config.BannerId);
        if (banner == null) {
            banner = document.createElement("div");
            banner.id = $$.Banner.Config.BannerId;
            banner.classList.add("banner");
            $$.Set(document.body, banner, true);
        }
        
        var message = document.createElement("div");
        message.classList.add("message");
        message.classList.add(type.toLowerCase());
        if ($$.Banner.Config.AutoHideAll === true || aHide) {
            _autoHide(message, $$.Banner.Config.AutoHideTimeout);
        }
        var icon = document.createElement("span");
        icon.classList.add("awesome");
        icon.classList.add("bold");
        icon.classList.add("icon");
        switch (type) {
            case "error":
                $$.Set(icon, "\uf057");
                break;
            case "success":
                $$.Set(icon, "\uf058");
                break;
            case "warning":
                $$.Set(icon, "\uf071");
                break;
            case "info":
            default:
                $$.Set(icon, "\uf05a");
                break;
        }
        $$.Set(message, icon, true);
        var divText = document.createElement("div");
        divText.classList.add("text");
        $$.Set(divText, text);
        $$.Set(message, divText, true);
        var close = document.createElement("span");
        close.classList.add("awesome");
        close.classList.add("bold");
        close.classList.add("close");
        $$.Set(close, "\uf00d");
        $$.Events.Add(close, "click", function(event) {
            $$.Banner.Hide(this.parentNode);
        });
        $$.Set(message, close, true);
        $$.Set(banner, message, true);
    },
    ShowMessages : function(messages) {
        var toShow = messages;
        if (!Array.isArray(messages)) {
            toShow = [ messages ];
        }
        
        $$.ForEach(toShow, function(value) {
            if (typeof(value.text) === "string") {
                $$.Banner.ShowMessage(value.severity, $$.L10N.Replace(value.text, value.vars));
            } else {
                $$.L10N.Get("messages." + value.category + "." + value.severity + "." + value.number, function(text) {
                    $$.Banner.ShowMessage(value.severity, text, value.autohide);
                }, value.vars);
            }
        });
    }
};
