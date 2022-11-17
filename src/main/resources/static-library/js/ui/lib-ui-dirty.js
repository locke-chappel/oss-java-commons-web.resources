/* ui/lib-ui-dirtyl.js */
$$.UI.Dirty = {
    Ignored : {},
    IsDirty : false,
    Set : function(isDirty) {
        $$.UI.Dirty.IsDirty = isDirty !== false;
    },
    Regsiter : function() {
        var inputs = document.querySelectorAll("input, select, textarea");
        $$.ForEach(inputs, function(input) {
            if ($$.UI.Dirty.Ignored[input.id] === true) { 
                return;
            }
            $$.Events.Add(input, "change", function(event) {
                $$.UI.Dirty.Set(true);
            });
        });
    },
    Warn : function(callback) {
        if ($$.UI.Dirty.IsDirty === false) {
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
