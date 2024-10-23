/* lib-timers.js */
$$.Timers = {
    Session : {
        _resetTimer : null,
        _refreshTimer : null,
        IsEnabled : #context.timeout.enabled#,
        Refresh : null,
        Timeout : -1,
        Reset : function() {
            var timeout = $$.Timers.Session.Timeout;
            if (typeof(timeout) === "function") {
                timeout = $$.Timers.Session.Timeout();
            }
            if ($$.Timers.Session.IsEnabled !== true || timeout < 0) {
                return;
            }
            
            if ($$.Timers.Session._resetTimer != null) {
                clearTimeout($$.Timers.Session._resetTimer);
            }
            
            if ($$.Timers.Session._refreshTimer != null) {
                clearTimeout($$.Timers.Session._refreshTimer);
            }
            
            $$.Timers.Session._refreshTimer = setTimeout(function(){ 
                if (typeof($$.Timers.Session.Refresh) === "function") { 
                    $$.Timers.Session.Refresh();
                }
            }, timeout - 30000);
            $$.Timers.Session._resetTimer = setTimeout(function(){ 
                $$.URL.Go("/");
            }, timeout);
        }
    }
};

$$.Init.Add($$.Timers.Session.Reset);
