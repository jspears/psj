var FunctionMap = {

};


module.exports = {
    FunctionMap: FunctionMap,
    resolve: function (resolver, v, func) {
        var namespace = v.uri || v.tagdir || v;
        if (FunctionMap[namespace]) {
            return FunctionMap[namespace][func];
        }

        return resolver(namespace, null, function (path, callback) {
            try {
                callback(null, require(path));
            } catch (e) {
                callback(e);
            }
        }).then(function(obj){
            var f = (FunctionMap[namespace] = obj)[func];
                return f;
        });

    }
};