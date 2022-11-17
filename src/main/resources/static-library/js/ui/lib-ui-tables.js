/* ui/lib-ui-tables.js */
$$.UI.Tables = {
    Cells : {
        Date : function(value) {
            return $$.UI.Tables.Cells.Text(value == null ? "" : value.toLocaleString());
        },
        GetSorts : function(table) {
            var sorts = {};
            var t = $$.Find(table);
            if (t == null) {
                return sorts;
            }
            
            var cols = t.querySelectorAll("thead > tr > th > span");
            for (var i = 0; i < cols.length; i++) {
                if (cols[i].field != null && cols[i].currentDirection != null) {
                    sorts[cols[i].field] = cols[i].currentDirection;
                }
            }
            return sorts;
        },
        Header : function(col) {
            var th = document.createElement("th");
            if (col.text != null || typeof(col.sort) === "function") {
                var span = document.createElement("span");
                span.field = col.field;
                $$.Set(span, col.text);
                if (typeof(col.sort) === "function") {
                    span.classList.add("sortable");
                    var icon = document.createElement("span");
                    icon.classList.add("awesome");
                    icon.classList.add("bold");
                    $$.Set(span, icon, true);
                    $$.Events.Add(span, "click", function(event) {
                        if (span.currentDirection === "asc") {
                            span.currentDirection = "desc";
                            span.classList.add("desc");
                            span.classList.remove("asc");
                            $$.Set(icon, "\uf0dd");
                        } else if (span.currentDirection === "desc") {
                            span.currentDirection = null;
                            span.classList.remove("asc");
                            span.classList.remove("desc");
                            $$.Set(icon, "\uf0dc");
                        } else {
                            span.currentDirection = "asc";
                            span.classList.add("asc");
                            span.classList.remove("desc");
                            $$.Set(icon, "\uf0de");
                        }
                        col.sort(span.currentDirection);
                    });
                    var dir = col.defaultDirection == null ? "" : col.defaultDirection.trim().toLowerCase();
                    switch (dir) {
                        case "asc":
                            span.classList.add("asc");
                            span.currentDirection = "asc";
                            $$.Set(icon, "\uf0de");
                            break;
                        case "desc":
                            span.classList.add("desc");
                            span.currentDirection = "desc";
                            $$.Set(icon, "\uf0dd");
                            break;
                        default:
                            $$.Set(icon, "\uf0dc");
                            break;
                    }
                }
                $$.Set(th, span);
            }
            return th;
        },
        Blank : function(opts) {
            /*
             * Example opts:
             * {
             *   "customize" : <function>
             * }
             */
            var td = document.createElement("td");
            if (opts != null && typeof(opts.customize) === "function") {
                opts.customize(td);
            }
            return td;
        },
        Icon : function(opts) {
            /*
             * Example opts:
             * {
             *   "icon" : <string>,
             *   "click" : <function>,
             *   "tooltip" : <string>,
             *   "customize" : <function>
             * }
             */
            var td = document.createElement("td");
            var span = document.createElement("span");
            span.classList.add("icon");
            span.classList.add("awesome");
            span.classList.add("bold");
            $$.Set(span, opts.icon);
            if (typeof(opts.click) === "function") {
                $$.Events.Add(span, "click", opts.click);
                span.classList.add("btn");
            }
            if (typeof(opts.tooltip) === "string") {
                span.title = opts.tooltip;    
            }
            if (typeof(opts.customize) === "function") {
                opts.customize(span);
            }
            $$.Set(td, span);
            return td;
        },
        Link : function(opts) {
            /*
             * Example opts:
             * {
             *   "text" : <string>,
             *   "url" : <string>,
             *   "newWindow" : <boolean>,
             *   "tooltip" : <string>,
             *   "customize" : <function>
             * }
             */
            var td = document.createElement("td");
            var a = document.createElement("a");
            $$.Set(a, opts.text);
            a.href = opts.url;
            if (opts.newWindow !== false) {
                a.target = "_blank";
            }
            if (typeof(opts.tooltip) === "string") {
                a.title = opts.tooltip;    
            }
            if (typeof(opts.customize) === "function") {
                opts.customize(a);
            }
            $$.Set(td, a);
            return td;
        },
        LinkButton : function(opts) {
            /*
             * Example opts:
             * {
             *   "text" : <string>,
             *   "click" : <function>,
             *   "tooltip" : <string>,
             *   "customize" : <function>
             * }
             */
            var td = document.createElement("td");
            var span = document.createElement("span");
            span.classList.add("btn");
            $$.Set(span, opts.text);
            $$.Events.Add(span, "click", opts.click);
            if (typeof(opts.tooltip) === "string") {
                span.title = opts.tooltip;    
            }
            if (typeof(opts.customize) === "function") {
                opts.customize(span);
            }
            $$.Set(td, span);
            return td;
        },
        Text : function(opts) {
            /*
             * Example opts:
             * {
             *   "text" : <string>,
             *   "tooltip" : <string>,
             *   "customize" : <function>
             * }
             */
            var td = document.createElement("td");
            var span = document.createElement("span");
            $$.Set(span, opts.text);
            if (typeof(opts.tooltip) === "string") {
                span.title = opts.tooltip;    
            }
            if (typeof(opts.customize) === "function") {
                opts.customize(span);
            }
            $$.Set(td, span);
            return td;
        }
    },
    GetCurrentPage : function(table) {
        var page = 0;
        var t = $$.Find(table);
        if (t == null) {
            return page;
        }
        
        var spans = t.parentNode.querySelectorAll("div.pages > div.current > span");
        for (var i = 0; i < spans.length; i++) {
            var text = spans[i].textContent.trim();
            switch (text) {
                case ">":
                case "<":
                    break;
                default:
                    page = parseInt(text, 10) - 1;
                    break;
            }
        }
        return page;
    },
    Pagination : function(opts) {
        /*
         * Example opts:
         * {
         *   "total" : <int>,
         *   "pageSize" : <int>,
         *   "currentPage" : <int>,
         *   "onClick" : <function>
         * }
         */
        var _count = 7; /* How many to show + 2 (first and last) */
        var _delta = 3; /* How many to show +/- around current page */
        var _btn = function(text, pageNum, click) {
            var div = document.createElement("div");
            var btn = document.createElement("span");
            $$.Set(btn, text);
            if (typeof(click) === "function") {
                $$.Events.Add(btn, "click", function(event) {
                    click(pageNum, event);
                });
            }
            $$.Set(div, btn);
            return div;
        };
        
        var pageCount = Math.ceil(opts.total / opts.pageSize);
        var nextPage = opts.currentPage + 1;
        var prevPage = opts.currentPage - 1;
        if (prevPage < 0) {
            prevPage = 0;
        }
        if (nextPage >= pageCount) {
            nextPage = pageCount - 1;
        }
        
        var pages = document.createElement("div");
        pages.classList.add("pages");
        var btn;
        if (0 == opts.currentPage) {
            btn = _btn("<");
            btn.classList.add("current");
            $$.Set(pages, btn, true);
            btn = _btn("1");
            btn.classList.add("current");
            $$.Set(pages, btn, true);
        } else {
            btn = _btn("<", prevPage, opts.onClick);
            $$.Set(pages, btn, true);
            btn = _btn("1", 0, opts.onClick);
            $$.Set(pages, btn, true);
        }
        
        var start = 1;
        var stop = pageCount - 1;
        if (pageCount > _count) {
            start = opts.currentPage - _delta;
            stop = opts.currentPage + _delta + 1;
            if (start < 1) {
                start = 1;
                stop = _count;
            } else if (stop >= pageCount) {
                start = pageCount - _count;
                stop = pageCount - 1;
            }
        }
        
        if (start != 1) {
            var dots = document.createElement("div");
            dots.classList.add("dots");
            $$.Set(dots, "...");
            $$.Set(pages, dots, true);
        }
        
        for (var i = start; i < stop; i++) {
            if (i == opts.currentPage) {
                btn = _btn((i + 1).toString());
                btn.classList.add("current");
            } else {
                btn = _btn((i + 1).toString(), i, opts.onClick);
            }
            $$.Set(pages, btn, true);
        }
        
        if (stop != pageCount - 1) {
            var dots2 = document.createElement("div");
            dots2.classList.add("dots");
            $$.Set(dots2, "...");
            $$.Set(pages, dots2, true);
        }
        
        if (pageCount - 1 == opts.currentPage || pageCount < 1) {
            if (pageCount > 1) {
                btn = _btn(pageCount.toString());
                btn.classList.add("current");
                $$.Set(pages, btn, true);
            }
            btn = _btn(">");
            btn.classList.add("current");
            $$.Set(pages, btn, true);
        } else {
            btn = _btn(pageCount.toString(), pageCount - 1, opts.onClick);
            $$.Set(pages, btn, true);
            btn = _btn(">", nextPage, opts.onClick);
            $$.Set(pages, btn, true);
        }
        return pages;
    },
    Row : function(cells, rowData) {
        var row = document.createElement("tr");
        for (var i = 0; i < cells.length; i++) {
            var cell = cells[i](rowData);
            $$.Set(row, cell, true);
        }
        return row;
    },
    RowHeader : function(columns) {
        var row = document.createElement("tr");
        for (var i = 0; i < columns.length; i++) {
            if (columns[i] instanceof Element) {
                $$.Set(row, columns[i], true);
            } else {
                var cell = $$.UI.Tables.Cells.Header(columns[i]);
                $$.Set(row, cell, true);
            }
        }
        return row;
    },
    Table : function(data, cellFunctions, headerColumns) {
        var table = document.createElement("table");
        var header = document.createElement("thead");
        $$.Set(header,  $$.UI.Tables.RowHeader(headerColumns));
        $$.Set(table, header, true);
        var body = document.createElement("tbody");
        $$.Set(table, body, true);
        if (data == null || data.length < 1) {
            var row = document.createElement("tr");
            $$.L10N.Get("global.search.noResults", function(text) {
                var td = $$.UI.Tables.Cells.Text({
                    "text" : text    
                });
                td.classList.add("noData");
                td.colSpan = headerColumns.length;
                $$.Set(row, td);
            });
            $$.Set(body, row, true);
        } else {
            $$.ForEach(data, function(rowData) {
                var row = $$.UI.Tables.Row(cellFunctions, rowData);
                $$.Set(body, row, true);
            });
        }
        return table;
    }
};
