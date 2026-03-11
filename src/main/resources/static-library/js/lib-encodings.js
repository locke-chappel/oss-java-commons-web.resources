/* lib-encodings.js */
$$.Encodings = {
    Base64 : {
        /*
         * Base64 solution based on learnings from various articles on the 
         * Base64 algorithm and an encoding example solutions from
         * https://en.wikipedia.org/wiki/Base64
         * https://gist.github.com/jonleighton/958841 and
         * https://github.com/danguer/blog-examples/blob/master/js/base64-binary.js
         * 
         * This solution prioratizes correctness in all use cases, especially
         * binary encoding/decoding, therefore the common atob/btoa solutions
         * are not acceptable in this context as they can misbehave in certain
         * corner cases.  
         */
        _alphabet : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        _alphabetRegex : new RegExp("^[A-Za-z0-9+/]*[=]{0,2}$"), /* Warning: making the regex global will cause it track state! */
        _padding : "=",
        _offset1 : 2**6 - 1 << 18,
        _offset2 : 2**6 - 1 << 12,
        _offset3 : 2**6 - 1 << 6,
        _offset4 : 2**6 - 1,
        _offset1a : 2**6 - 1 << 2,
        _offset1b : 2**2 - 1,
        _offset2a : 2**6 - 1 << 10,
        _offset2b : 2**6 - 1 << 4,
        _offset2c : 2**4 - 1,
        
        /*
         * Removes all non-Base64 chars from the value string. 
         * Useful for removing newline formatting from inputs.
         */
        Clean : function(value) {
            if (value == null || typeof(value) != "string") {
                throw new Error("Base64.Clean value must be a Base64 string");
            }
            
            return value.replace($$.Encodings.Base64._alphabetRegex, "");
        },
        Encode : function(value) {
            if (value == null) {
                throw new Error("Base64.Encode value cannot be null");
            }
            
            var bytes = value;
            if (typeof(bytes) === "string") {
                bytes = new TextEncoder().encode(value);
            }
            var s = "";
            var length = bytes.byteLength;
            var remainder = length % 3;
            var dataLength = length - remainder;
            var tmp;
            var a;
            var b;
            var c; 
            var d;
            /* encode every 3 bytes as 4 chars from the Base64 alphabet */
            for (var i = 0; i < dataLength; i+=3) {
                tmp = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
                
                a = (tmp & $$.Encodings.Base64._offset1) >> 18;
                b = (tmp & $$.Encodings.Base64._offset2) >> 12;
                c = (tmp & $$.Encodings.Base64._offset3) >> 6;
                d = (tmp & $$.Encodings.Base64._offset4);
                
                s += $$.Encodings.Base64._alphabet[a] + 
                     $$.Encodings.Base64._alphabet[b] + 
                     $$.Encodings.Base64._alphabet[c] + 
                     $$.Encodings.Base64._alphabet[d];
            }
            
            /* 
             * Deal with any required padding to ensure total is a mulitple of 4.
             * 
             * Padding is always the lower most bits _before_ the padding chars - 
             * i.e. <data> + <padding bits> + <padding chars> 
             */
            switch (remainder) {
                case 1:
                    /* 4 bits of padding are needed + 2 padding symbols  */
                    tmp = bytes[dataLength];
                    
                    a = (tmp & $$.Encodings.Base64._offset1a) >> 2;
                    b = (tmp & $$.Encodings.Base64._offset1b) << 4;
                    
                    s += $$.Encodings.Base64._alphabet[a] +
                         $$.Encodings.Base64._alphabet[b] +
                         $$.Encodings.Base64._padding + 
                         $$.Encodings.Base64._padding;
                    break;
                case 2:
                    /* 2 bits of padding are needed + 1 padding symbol */
                    tmp = (bytes[dataLength] << 8) | bytes[dataLength + 1];
                    
                    a = (tmp & $$.Encodings.Base64._offset2a) >> 10;
                    b = (tmp & $$.Encodings.Base64._offset2b) >> 4;
                    c = (tmp & $$.Encodings.Base64._offset2c) << 2;
                                        
                    s += $$.Encodings.Base64._alphabet[a] +
                         $$.Encodings.Base64._alphabet[b] +
                         $$.Encodings.Base64._alphabet[c] +
                         $$.Encodings.Base64._padding;
                    break;
            }
            return s;
        },
        DecodeString : function(value) {
            return $$.Encodings.Base64.Decode(value, true);
        },
        Decode : function(value, toString) {
            if (value == null || typeof(value) != "string" || !$$.Encodings.Base64._alphabetRegex.test(value)) {
                throw new Error("Base64.Decode value must be a valid Base64 string");
            }
            
            var s = value;
            
            /* Remove padding */
            if (s.endsWith("==")) {
                s = s.substring(0, s.length - 2);
            } else if (s.endsWith("=")){
                s = s.substring(0, s.length - 1);
            }
            
            var len = Math.floor((s.length / 4) * 3);
            var bytes = new Uint8Array(len);
            
            var a;
            var b;
            var c; 
            var d;
            var x;
            var y;
            var z;
            var j = 0; /* position in encoded string */
            /* decode every 4 chars in to 3 bytes */
            for (var i = 0; i < len; i += 3) { /* i is the position in the decoded array */
                /* get the next 4 chars */
                a = s[j++];
                b = s[j++];
                c = s[j++];
                d = s[j++];
                
                /* get the int values of the char position in the alphabet */
                a = $$.Encodings.Base64._alphabet.indexOf(a);
                b = $$.Encodings.Base64._alphabet.indexOf(b);
                c = $$.Encodings.Base64._alphabet.indexOf(c);
                d = $$.Encodings.Base64._alphabet.indexOf(d);
                
                /* bit shift the 4 ints to 3 bytes */
                x = (a << 2) | (b >> 4);
                y = ((b & 15) << 4) | (c >> 2);
                z = ((c & 3)) << 6 | d;
                
                /* store the bytes into the array at the correct position */
                bytes[i] = x;
                if (c != 64) {
                    bytes[i + 1] = y;
                }
                
                if (d != 64) {
                    bytes[i + 2] = z;
                }
            }
                       
            if (toString === true) {
                return new TextDecoder().decode(bytes);
            }
            return bytes;
        }
    },
    Hex : {
        Encode : function(value) {
            if (value == null) {
                throw new Error("Hex.Encode value cannot be null");
            }
            
            var bytes = value;
            if (typeof(bytes) === "string") {
                bytes = new TextEncoder().encode(value);
            }
            
            var s = "";
            for (var i = 0; i < bytes.byteLength; i++) {
                s += bytes[i].toString(16).padStart(2, "0");
            }
            return s;
        },
        DecodeString(value){
            return $$.Encodings.Hex.Decode(value, true);
        },        
        Decode : function(value, toString) {
            if (value == null || typeof(value) != "string" || value.length % 2 != 0) {
                throw new Error("Hex.Decode value must be a valid hexidecimal string");
            }
            
            var ints = [];
            for (var i = 0; i < value.length; i += 2) {
                ints.push(parseInt(value.substring(i, i + 2), 16));
            }
            
            if (toString === true) {
                return new TextDecoder().decode(Uint8Array.from(ints));
            }
            return Uint8Array.from(ints);
        }
    }
};
