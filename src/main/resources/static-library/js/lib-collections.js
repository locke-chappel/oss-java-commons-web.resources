/* lib-collections.js */
$$.Collections = {
    Contains : function(collection, value) {
        if (collection == null || value == null) {
            return false;
        }
        
        if (Array.isArray(collection)) {
            return collection.includes(value);
        }
        
        return collection[value] != null;
    },
    IsEmpty : function(collection) {
        if (collection == null) {
            return true;
        }
        
        if (Array.isArray(collection)) {
            return collection.length === 0;
        }
        
        return Object.getOwnPropertyNames(collection).length === 0;
    }
};
