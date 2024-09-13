/* lib-sorting.js */
$$.Sorting = {
    _nullSort : function(a, b, reverse) {
        if (a == null && b != null) {
            return reverse === true ? -1 : 1;
        }
        
        if (a != null && b == null) {
            return reverse === true ? 1 : -1;
        }
        
        return 0;
    },
    Fields : function(array, evaluator, reverse, comparator) {
        if (array == null || array.length < 2) {
            return;
        }
        
        if (typeof(comparator) !== "function") {
            var sample = evaluator(array[0]);
            if (typeof(sample) === "number") {
                comparator = $$.Sorting.Numeric;
            } else {
                comparator = $$.Sorting.String;
            }
        }
        
        array.sort(function(a, b) {
            return comparator(evaluator(a), evaluator(b), reverse);
        });
    },
    Numeric : function(a, b, reverse) {
        if (a === b) {
            return 0;
        }
        
        var result = $$.Sorting._nullSort(a, b, reverse);
        if (result != 0) {
            return result;
        }
        
        if (reverse === true) {
            return b - a;
        }
        return a - b;
    },
    ObjectKeys : function(object, reverse) {
        if (reverse === true) {
            return Object.keys(object).sort().reverse().reduce((obj, key) => { 
                obj[key] = object[key]; 
                return obj;
              }, {});
          } else {
            return Object.keys(object).sort().reduce((obj, key) => { 
                obj[key] = object[key]; 
                return obj;
              }, {});
        }
    },
    String : function(a, b, reverse) {
        if (a === b) {
            return 0;
        }
        
        var result = $$.Sorting._nullSort(a, b, reverse);
        if (result != 0) {
            return result;
        }
        
        if (reverse === true) {
            return b.localeCompare(a);
        }
        return a.localeCompare(b);
    }
};
