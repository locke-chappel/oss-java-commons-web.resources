/* ui/lib-ui-spinner.js */
$$.UI.Spinner = {
    _timer : null,
    _count : 0,
    _display : function(show, id) {
        var sid = id == null ? "spinner" : id;
        var spinner = $$.Find(sid);
        if (spinner == null) {
            return;
        }
        
        if (show === true) {
            spinner.classList.remove("hidden");
        } else {
            if ($$.UI.Spinner._timer != null) {
                if ($$.UI.Spinner._count > 1) {
                    $$.UI.Spinner._count--;
                } else {
                    $$.UI.Spinner._count = 0;
                    clearTimeout($$.UI.Spinner._timer);
                    $$.UI.Spinner._timer = null;
                }
            }
            spinner.classList.add("hidden");
        }
    },
    Delay : function(wait, id) {
        if ($$.UI.Spinner._timer == null) {
            $$.UI.Spinner._count = 1;
            $$.UI.Spinner._timer = setTimeout(function() {
                $$.UI.Spinner.Show(id);
            }, wait);
            
        } else {
            $$.UI.Spinner._count++;
        }
    },
    Hide : function(id) {
        $$.UI.Spinner._display(false, id);
    },
    Show : function(id) {
        $$.UI.Spinner._display(true, id);
    }
};
