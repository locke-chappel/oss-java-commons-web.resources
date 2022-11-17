/* ui/lib-ui-cell.js */
$$.UI.Cell = function(opts) {
    /*
     * Example opts:
     * {
     *     "header" : element,
     *     "content" : element,
     * }
     */
    if (opts == null) {
        opts = {};
    }
    
    var divCell = document.createElement("div");
    divCell.classList.add("cell");
    
    var divHeader = document.createElement("div");
    divHeader.classList.add("header");
    $$.Set(divCell, divHeader);
    if (opts.header != null) {
        $$.Set(divHeader, opts.header);
    }
    
    if (opts.content != null) {
        $$.Set(divCell, opts.content, true);
    }
    
    return divCell;
};
