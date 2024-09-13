/* lib-dom.js */
$$.Clear = function(element) {
    var e = $$.Find(element);
    while (e.firstChild) {
        e.removeChild(e.firstChild);
    }
};

$$.Events = {
    Add : function(element, event, func) {
        var e = $$.Find(element);
        e.addEventListener(event, func);
    },
    Cancel : function(event) {
        event.preventDefault();
        event.stopPropagation();  
    },
    KeyCodes : {
        Backsapce: 8,
        Tab : 9,
        Enter : 13,
        Shift: 16,
        Control : 17,
        CapsLock : 20,
        Escape : 27,
        Space : 32,
        Left : 37,
        Up : 38,
        Right : 39,
        Down : 40,
        Delete : 46,
        Meta : 91,
        Windows : 91,
        Context : 93
    },
    Remove : function(element, event, func) {
        var e = $$.Find(element);
        e.removeEventListener(event, func);
    },
    SafeClick : function(element, func) {
        $$.Events.Add(element, "click", function(event) {
            this.disabled = true;
            setTimeout(function() {
                $$.Find(element).disabled = false;
            }, 500);
            func(event);
        });
    }
};

$$.Find = function(id) {
    if (typeof(id) === "string") {
        return document.getElementById(id);
    }
    return id;
};

$$.FindByAttribute = function(attribute, value, root) {
    var r = root == null ? document : root;
    var query = ":scope > [" + attribute;
    if (value != null) {
        query += "='" + value + "'";
    }
    query += "]";
    var e = r.querySelectorAll(query);
    if (e == null || e.length < 1) {
        return null;
    } else if (e.length > 1) {
        return e;
    }
    return e[0];
};

$$.Insert = function(element, relativeTo, mode) {
    /* https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement */
    /*
     * Modes:
     *   - 'beforebegin': Before the targetElement itself.
     *   - 'afterbegin': Just inside the targetElement, before its first child.
     *   - 'beforeend': Just inside the targetElement, after its last child.
     *   - 'afterend': After the targetElement itself.
     */
    $$.Find(relativeTo).insertAdjacentElement(mode, element);
};

$$.ParseHtml = function(html) {
    return Array.prototype.slice.call(new DOMParser().parseFromString(html, "text/html").body.children);
};

$$.Set = function(parent, children, append) {
    var p = $$.Find(parent);
    if (append !== true) {
        $$.Clear(p);
    }
    if (children != null) {
        if (typeof(children) === "string" || typeof(children) === "number") {
            p.appendChild(document.createTextNode(children));
        } else if (Array.isArray(children)) {
            for (var i = 0; i < children.length; i++) {
                p.appendChild(children[i]);
            }
        } else {
            p.appendChild(children);
        }
    }
};

/* Register init functions */
$$.Events.Add(window, "DOMContentLoaded", function(event) {
    setTimeout(function(){
        $$.Init.Run();
    }, 1);
});
