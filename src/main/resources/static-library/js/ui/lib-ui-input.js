/* ui/lib-ui-input.js */
$$.UI.Input = function(opts) {
    /*
     * Example opts:
     * {
     *     "type" : "text",
     *     "label" : "Input's Label",
     *     "text" : "Other Text",
     *     "value" : "initial value",
     *     "tooltip" : "<tool tip>",
     *     "id" : "txtInput",
     *     "inline": : false,
     *     "required" : false,
     *     "sliderTrue" : "Enabled",
     *     "sliderFalse" : "Disabled",
     *     "min" : 0,
     *     "max" : 100,
     *     "step" : 5,
     *     "accept" : "mime/1,mime/2",
     *     "customize" : <function>
     * }
     */
    if (opts == null) {
        opts = {};
    }
    
    var divInput = document.createElement("div");
    divInput.classList.add("input");
    
    var spnLabel = null;
    if (opts.label != null && opts.type !== "checkbox") {
        spnLabel = document.createElement("span");
        spnLabel.classList.add("lbl");
        if (opts.required === true) {
            spnLabel.classList.add("required");
        }
        $$.Set(spnLabel, opts.label);
        
        if (opts.inline === true) {
            $$.Set(divInput, spnLabel);   
        } else {
            var divLabel = document.createElement("div");
            divLabel.classList.add("lbl");
            $$.Set(divLabel, spnLabel);
            $$.Set(divInput, divLabel);
        }
    }
    
    var input;
    switch (opts.type) {
        case "checkbox":
            divInput.classList.add("checkbox");
            divInput.classList.add("styled");
            input = document.createElement("input");
            input.type = "checkbox";
            input.id = opts.id == null ? "chk" + crypto.randomUUID() : opts.id;
            if (opts.value != null) {
                input.checked = opts.value;    
            }
            $$.Set(divInput, input, true);
            
            if (opts.label != null) {
                var label = document.createElement("label");
                label.classList.add("lbl");
                label.setAttribute("for", input.id);
                if (opts.required === true) {
                    label.classList.add("required");
                }
                $$.Set(label, opts.label);
                
                if (opts.inline !== false) {
                    $$.Set(divInput, label, true);   
                } else {
                    var divLabel = document.createElement("div");
                    divLabel.classList.add("lbl");
                    $$.Set(divLabel, label);
                    $$.Set(divInput, divLabel, true);
                }
            }
            break;
        case "range":
            var divRange = document.createElement("div");
            divRange.classList.add("range");
            input = document.createElement("input");
            input.type = "range";
            input.id = opts.id;
            input.min = opts.min;
            input.max = opts.max;
            input.step = opts.step;
            if (opts.value != null) {
                input.value = opts.value;    
            }
            if (opts.tooltip != null) {
                input.title = opts.tooltip;    
            }
            $$.Set(divRange, input);
            $$.Set(divInput, divRange, true);
            break;
        case "slider":
            var divSlider = document.createElement("div");
            divSlider.classList.add("slider");
            input = document.createElement("input");
            input.type = "checkbox";
            input.id = opts.id;
            if (opts.value != null) {
                input.value = opts.value;    
            }
            $$.Set(divSlider, input);
            var lblSlider = document.createElement("label");
            lblSlider.htmlFor = input.id;
            var spnSliderInner = document.createElement("span");
            spnSliderInner.classList.add("inner");
            var spnSliderBefore = document.createElement("span");
            spnSliderBefore.classList.add("before");
            $$.Set(spnSliderBefore, opts.sliderTrue);
            $$.Set(spnSliderInner, spnSliderBefore);
            var spnSliderAfter = document.createElement("span");
            spnSliderAfter.classList.add("after");
            $$.Set(spnSliderAfter, opts.sliderFalse);
            $$.Set(spnSliderInner, spnSliderAfter, true);
            $$.Set(lblSlider, spnSliderInner);
            var spnSliderSwitch = document.createElement("span");
            spnSliderSwitch.classList.add("switch");
            $$.Set(lblSlider, spnSliderSwitch, true);
            $$.Set(divSlider, lblSlider, true);
            $$.Set(divInput, divSlider, true);
            break;
        case "text":
        case "url":
        case "password":
        case "number":
            input = document.createElement("input");
            input.type = opts.type;
            input.id = opts.id;
            if (opts.value != null) {
                input.value = opts.value;    
            }
            if (opts.tooltip != null) {
                input.title = opts.tooltip;    
            }
            if (opts.type === "number") {
                input.min = opts.min;
                input.max = opts.max;
            } else {
                input.maxLength = opts.max;
            }
            $$.Set(divInput, input, true);
            break;
        case "textarea":
            input = document.createElement("textarea");
            input.id = opts.id;
            input.maxLength = opts.max;
            if (opts.value != null) {
                input.value = opts.value;    
            }
            $$.Set(divInput, input, true);
            break;
        case "upload":
            divInput.classList.add("upload");
            var txt = document.createElement("input");
            txt.type = "text";
            txt.id = opts.id + "_txt";
            $$.Set(divInput, txt, true);
            var btn = document.createElement("button");
            btn.id = opts.id + "_btn";
            $$.Set(btn, opts.text);
            $$.Set(divInput, btn, true);
            input = document.createElement("input");
            input.id = opts.id;
            input.type = "file";
            input.accept = opts.accept;
            $$.Set(divInput, input, true);
            
            $$.Events.Add(txt, "click", function(event) {
                input.click();
            });
            
            $$.Events.Add(btn, "click", function(event) {
                input.click();
            });
            
            $$.Events.Add(input, "change", function(event) {
                if (this.files.length < 1) {
                    txt.value = null;
                    return;
                }
                
                var name = this.files[0].name;
                for (var i = 1; i < this.files.length; i++) {
                    name += "; " + this.files[i].name;
                }
                txt.value = name;
            });
            break;
        default:
            throw "Unsupported type '" + opts.type + "'";
    }
    
    if (opts.type === "url") {
        $$.UI.InputFunctions.RegisterUrlInput(divInput);
    }
    
    if (typeof(opts.customize) === "function") {
        opts.customize(input, divInput);
    }
    
    return divInput;
};

$$.UI.InputFunctions = {
    RegisterUrlInput : function(divInput) {
        var div = $$.Find(divInput);
        div.classList.add("url");
        
        var input = div.querySelectorAll("input")[0];
        $$.Events.Add(input, "click", function(event) {
            if (document.body.classList.contains("ctrl")) {
                var url = $$.Text.Trim(input.value, true);
                if (url != null) {
                    $$.URL.NewWindow(input.value);
                }
            }
        });
        
        if (window.InputUrlHandlerRegister !== true) {
            window.InputUrlHandlerRegister = true;
            $$.Events.Add(window, "keydown", function(event) {
                if (event.keyCode === $$.Events.KeyCodes.Control) {
                    document.body.classList.add("ctrl");
                }
            });
            $$.Events.Add(window, "keyup", function(event) {
                if (event.keyCode === $$.Events.KeyCodes.Control) {
                    document.body.classList.remove("ctrl");
                }
            });
        }
    }
};
