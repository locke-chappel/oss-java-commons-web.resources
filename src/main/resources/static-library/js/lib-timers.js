/* lib-timers.js */
$$.Timers = {
    Session : {
        _resetTimer : null,
        _refreshTimer : null,
        IsEnabled : #context.timeout.enabled#,
        Refresh : null,
        Timeout : -1,
        Reset : function() {
            if ($$.Timers.Session.IsEnabled !== true || $$.Timers.Session.Timeout < 0) {
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
            }, $$.Timers.Session.Timeout - 30000);
            $$.Timers.Session._resetTimer = setTimeout(function(){ 
                $$.URL.Go("/");
            }, $$.Timers.Session.Timeout);
        }
    }
};

$$.Init.Add($$.Timers.Session.Reset);
