var path = require('path'), ctxMap = {
    'http://java.sun.com/jsp/jstl/core': path.join(__dirname,'/tag/core'),
    'http://java.sun.com/JSP/Page': path.join(__dirname+'/tag/jsp'),
    'http://java.sun.com/jsp/jstl/functions':path.join(__dirname+'/tag/jstl/functions')
}
module.exports = ctxMap;
