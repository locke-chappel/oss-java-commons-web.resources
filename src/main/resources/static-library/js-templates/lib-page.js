/* js-templates/lib-page.js */
$$.Timers.Session.Timeout = function() {
    var c = $$.Cookies.Read("#session.timeout.cookie#");
    if (c != null) {
        return parseInt(c, 10);
    }
    return #context.timeout#;
};
$$.Init.Add($$.App.Views.%Page%.Init);
