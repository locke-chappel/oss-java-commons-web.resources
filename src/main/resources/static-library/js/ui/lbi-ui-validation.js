/* ui/lib-ui-validation.js */
$$.UI.Validation = {
	InputRange : function() {
        var inputs = document.querySelectorAll("input[type=\"number\"]");
        $$.ForEach(inputs, function(input) {
            $$.Events.Add(input, "change", function(event) {
                var num = parseInt(input.value, 10);
                if (num < input.min) {
                    input.value = input.min;
                } else if (num > input.max) {
                    input.value = input.max;
                }
            });
        });
	}
};
