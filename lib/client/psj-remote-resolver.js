define(['q', 'psj-namespace-map-remote'], function (Q, ctxMap) {
    function resolver(v, file, reader) {
        reader = reader || function (fullPath, cb) {
            // fs.readFile(path.resolve(fullPath) + '.tag', 'utf-8', cb)
            require(['text!'+fullPath + '.tag'], function (resp) {
                return cb(null, resp);
            })
        }
        var f = ctxMap[v.uri || v.tagdir || v] || v.tagdir || v;
        var d = Q.defer();
        var fullPath = (file ? f + '/' + file : f);
        reader(fullPath, d.makeNodeResolver());
        return d.promise;
    }

    return resolver;
})
