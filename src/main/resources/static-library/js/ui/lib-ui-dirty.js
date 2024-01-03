/* ui/lib-ui-dirtyl.js */
$$.UI.Dirty = {
    Ignored : {},
    _scopes : {
		"Default" : false
	},
	_getScope : function(scope) {
		if ($$.Text.IsBlank(scope)) {
			return "Default";
		}
		return $$.Text.Trim(scope);
	},
    IsDirty : function(scope) {
		var s = $$.UI.Dirty._getScope(scope);
		return $$.UI.Dirty._scopes[s] === true; 
	},
    Set : function(isDirty, scope) {
		var s = $$.UI.Dirty._getScope(scope);
        $$.UI.Dirty._scopes[s] = isDirty !== false;
    },
    Regsiter : function(root, scope) {
		var r = $$.Find(root);
	    if (r == null) {
			r = document;
		}
		
        var inputs = r.querySelectorAll("input, select, textarea");
        $$.ForEach(inputs, function(input) {
            if ($$.UI.Dirty.Ignored[input.id] === true) { 
                return;
            }
            $$.Events.Add(input, "change", function(event) {
                $$.UI.Dirty.Set(true, scope);
            });
        });
    },
    Warn : function(callback, scope) {
        if ($$.UI.Dirty.IsDirty(scope) === false) {
            callback();
            return;
        }
        
        $$.L10N.Get([
            "global.buttons.cancel",
            "global.buttons.yes",
            "global.modal.dirty.header",
            "global.modal.dirty.message"
        ], function(texts){
            $$.UI.Modal.Show({
                "id" : "dirtyModal",
                "cssClasses" : "dirty",
                "header" : texts["global.modal.dirty.header"],
                "body" : texts["global.modal.dirty.message"],
                "footer" : $$.UI.Modal.Footers.Confirm({
                    "modalId" : "dirtyModal",
                    "ok" : function(event) {
                        callback();
                     },
                     "okText" : texts["global.buttons.yes"]
                })
            }); 
        });
    }
};
