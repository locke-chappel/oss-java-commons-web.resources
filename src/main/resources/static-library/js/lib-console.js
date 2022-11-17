/* lib-console.js */
$$.Console = {
    _logPrefix : "#context.logging.prefix# ",
    Log : function(message, severity) {
        if (severity == null) {
            severity = "INFO";
        }
        console.log($$.Console._logPrefix + "[" + severity.toUpperCase() + "] (" + new Date().getTime() + "): " + message);
    }
};
