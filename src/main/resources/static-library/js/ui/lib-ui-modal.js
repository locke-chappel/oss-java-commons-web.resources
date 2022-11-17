/* ui/lib-ui-modal.js */
$$.UI.Modal = {
    _defaultId : "modal",
    Footers : {
        Confirm : function(opts) {
            /*
             * Example Options
             * {
             *     "ok" : function(event) {
             *     },
             *     "okText" : "Yes",
             *     *okCssClasses" : <string | [string],
             *     "cancel" : function(event) {
             *     },
             *     "cancelText" : "No",
             *     "cancelCssClasses" : <string | [string],
             *     "modalId" : "customModal",
             *     "singleButton" : false,
             *     "enterCloses" : true,
             *     "enterIsOK" : false
             * }
             */
            if (opts == null) {
                opts = {};
            }
            
            var baseId = typeof(opts.modalId) === "string" ? opts.modalId : $$.UI.Modal._defaultId;
            
            var footer = document.createElement("div");
            footer.classList.add("buttons");
            
            var btnCancel = document.createElement("button");
            var btnOk = document.createElement("button");
            if (opts.cancelCssClasses != null) {
                if (typeof(opts.cancelCssClasses) === "string") {
                    btnCancel.classList.add(opts.cancelCssClasses);
                } else {
                    $$.ForEach(opts.cancelCssClasses, function(value) {
                        btnCancel.classList.add(value);
                    });
                }
            }
            
            var _onKeyUp = function(event) {
                if (event.keyCode === $$.Events.KeyCodes.Escape) {
                    $$.Events.Cancel(event);
                    btnCancel.click();
                }
                
                if (event.keyCode === $$.Events.KeyCodes.Enter) {
                    if (opts.enterIsOK === true) {
	                    $$.Events.Cancel(event);
                        btnOk.click();
                    } else if (opts.enterCloses !== false) {
                        $$.Events.Cancel(event);
                        btnCancel.click();
                    }
                }
            };

            if (opts.singleButton !== true) {
                if (opts.okCssClasses != null) {
                    if (typeof(opts.okCssClasses) === "string") {
                        btnOk.classList.add(opts.okCssClasses);
                    } else {
                        $$.ForEach(opts.okCssClasses, function(value) {
                            btnOk.classList.add(value);
                        });
                    }
                }
                if (typeof(opts.okText) === "string") {
                    $$.Set(btnOk, opts.okText);
                } else {
                    $$.L10N.Get("global.buttons.ok", function(text) {
                        $$.Set(btnOk, text);
                    });
                }
                btnOk.id = baseId + "_btnOk";
                $$.Events.Add(btnOk, "click", function(event) {
                    if (typeof(opts.ok) === "function") {
                        if (opts.ok(event) === true) {
                            return;
                        }
                    }
                    footer.CloseModal();
                });
                $$.Set(footer, btnOk);
            }
            
            if (typeof(opts.cancelText) === "string") {
                $$.Set(btnCancel, opts.cancelText);
            } else {
                var textId = opts.singleButton === true ? "global.buttons.close" : "global.buttons.cancel";
                $$.L10N.Get(textId, function(text) {
                    $$.Set(btnCancel, text);
                });
            }
            btnCancel.classList.add("default");
            btnCancel.id = baseId + "_btnCancel";
            $$.Set(footer, btnCancel, true);
            $$.Events.Add(btnCancel, "click", function(event) {
                if (typeof(opts.cancel) === "function") {
                   if (opts.cancel(event) === true) {
                       return;
                   }
                }
                footer.CloseModal();
            });
            
            $$.Events.Add(window, "keyup", _onKeyUp);
            
            footer.CloseModal = function() {
                $$.Events.Remove(window, "keyup", _onKeyUp);
                $$.UI.Modal.Hide(baseId);
            };
            
            return footer;
        }
    },
    Hide : function(id) {
        $$._inProgress.Add();
        var modalId = id;
        if (typeof(modalId) !== "string") {
            modalId = $$.UI.Modal._defaultId;
        }
        var modal = $$.Find(modalId);
        if (modal.generated === true) {
            modal.parentNode.removeChild(modal);
        } else {
            modal.classList.remove("show");
            var elements = modal.querySelectorAll("div.header, div.body, div.footer");
            $$.ForEach(elements, $$.Clear);
        }
        $$._inProgress.Complete();
    },
    Show : function(opts) {
        /*
         * Example Options
         * {
         *     "header" : <DOM Element || DOM Element []>,
         *     "body" : <DOM Element || DOM Element []>,
         *     "footer" : <DOM Element || DOM Element []>,
         *     "cssClasses" : <String || String[] - Only applies if id is also specified>,
         *     "id" : <String>
         * }
         */
        $$._inProgress.Add();
        var modalId = opts.id;
        if (typeof(modalId) !== "string") {
            modalId = $$.UI.Modal._defaultId;
        }
        var modal = $$.Find(modalId);
        if (modal == null) {
            modal = document.createElement("div");
            modal.id = modalId;
            modal.generated = true;
            modal.classList.add("modal");
            if (typeof(opts.id) === "string" && opts.cssClasses != null) {
                if (typeof(opts.cssClasses) === "string") {
                    modal.classList.add(opts.cssClasses);
                } else {
                    $$.ForEach(opts.cssClasses, function(value) {
                        modal.classList.add(value);
                    });
                }
            }
        
            var dialog = document.createElement("div");
            dialog.classList.add("dialog");
            $$.Set(modal, dialog, true);
            
            var dHeader = document.createElement("div");
            dHeader.classList.add("header");
            $$.Set(dialog, dHeader, true);
            
            var dBody = document.createElement("div");
            dBody.classList.add("body");
            $$.Set(dialog, dBody, true);
            
            var dFooter = document.createElement("div");
            dFooter.classList.add("footer");
            $$.Set(dialog, dFooter, true);
            
            $$.Set(document.body, modal, true);
        }
        
        var div = modal.querySelectorAll("div.header")[0];
        $$.Set(div, opts.header);
        
        div = modal.querySelectorAll("div.body")[0];
        $$.Set(div, opts.body);
        
        div = modal.querySelectorAll("div.footer")[0];
        $$.Set(div, opts.footer);
        
        modal.classList.add("show");
        $$._inProgress.Complete();
    }
};
