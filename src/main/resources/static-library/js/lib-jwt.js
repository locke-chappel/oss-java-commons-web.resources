/* lib-jwt.js */
$$.JWT = {
    Parse : function(token) {
        var data = $$.Text.Trim(token, true);
        if (data == null) {
            return null;
        }
        
        var parts = data.split(".");
        if (parts.length != 3) {
            return null;
        }
        
        var t = {};
        t.header = JSON.parse($$.Text.Base64.Decode(parts[0]));
        t.payload = JSON.parse($$.Text.Base64.Decode(parts[1]));
        t.signature = parts[2];
        return t;
    }
};
