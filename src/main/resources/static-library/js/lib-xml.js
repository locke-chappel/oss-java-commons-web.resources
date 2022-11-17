/* lib-xml.js */
$$.XML = {
    Parse : function(xml) {
        return new DOMParser().parseFromString(xml, "application/xml");
    },
    Node : function(root, tagName, childIndex) {
        var i = childIndex;
        if (typeof(i) !== "number" || i < 0) {
            i = 0;
        }
        
        if (tagName.indexOf(".") > 0) {
            var parent = tagName.substr(0, tagName.indexOf("."));
            var child = tagName.substr(tagName.indexOf(".") + 1);
            var newRoot = $$.XML.Node(root, parent, i);
            return $$.XML.Node(newRoot, child, i);
        }
        
        return root.getElementsByTagName(tagName)[i];
    },
    Value : function(root, tagName, childIndex) {
        return $$.XML.Node(root, tagName, childIndex).childNodes[0].nodeValue;
    }
};
