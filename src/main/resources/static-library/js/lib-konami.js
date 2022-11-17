/* lib-konami.js */
$$.KonamiCode = {
    _code : [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
    _position : 0,
    _keyUp : function() {
        $$.Events.Add(window, "keyup", function(event) {
            if ($$.KonamiCode._code[$$.KonamiCode._pos] === event.keyCode) {
                $$.KonamiCode._pos++;
            } else {
                $$.KonamiCode._pos = 0;
            }
            if ($$.KonamiCode._pos >= $$.KonamiCode._code.length) {
                if (typeof($$.KonamiCode.Success) === "function" ) {
                    $$.KonamiCode.Success();
                }
                $$.KonamiCode._pos = 0;
            }
        });
    },
    Success : null
};

$$.Init.Add($$.KonamiCode._keyUp);
