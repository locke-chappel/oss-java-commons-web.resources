/* ui/lib-menu.js */
$$.UI.Menu = {
    CreateItem : function(label, onClick) {
        var item = document.createElement("div");
        item.classList.add("item");
        var lined = document.createElement("div");
        lined.classList.add("lined");
        $$.Set(item, lined);
        var btn = document.createElement("span");
        $$.Set(btn, label);
        if (typeof(onClick) === "function") {
            $$.Events.Add(btn, "click", function(event) {
                onClick(event);
            });
        }
        $$.Set(lined, btn);
        return item;
    },
    Configure : function(buttonId, menuId) {
        var button = $$.Find(buttonId);
        if (button == null) {
            return;
        }
        
        var _isDecendent = function(e, ancestor) {
            if (e == null || e.nodeName.toLowerCase() === "body") {
                return false;
            }
            
            if (e === ancestor) {
                return true;
            }
            
            if (e.parentNode === ancestor) {
                return true;
            }
            
            return _isDecendent(e.parentNode, ancestor);
        };
        
        
        button.toggle = function(event) {
            $$.Events.Cancel(event);
            var menu = $$.Find(menuId);
            if (_isDecendent(event.target, menu)) {
                return;
            }
            if (menu.classList.contains("show")) {
                menu.classList.remove("show");
                $$.Events.Remove(window, "click", button.toggle);
            } else {
                menu.classList.add("show");
                $$.Events.Add(window, "click", button.toggle);
            }
        };
        $$.Events.Add(button, "click", button.toggle);
    }
};
