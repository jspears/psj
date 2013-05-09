if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}
define(function () {
    function contains(str, pattern) {
        return str && str.indexOf(pattern) > -1;
    }

    function containsIgnoreCase(str, pattern) {
        return contains(str && str.toUpperCase(), pattern && pattern.toUpperCase());
    }

    function startsWith(str, suffix) {
        if (!(str && suffix)) return false;
        return str.indexOf(suffix) === 0;
    }

    function endsWith(str, postfix) {
        if (!(str && postfix)) return false;
        return str.lastIndexOf(postfix) === str.length - postfix.length;
    }

    function indexOf(str, substring) {
        return str.indexOf(substring);
    }

    function join(arr, seperator) {
        return arr && arr.join(seperator);
    }

    function length(input) {
        if (!input) return 0;
        if (input.length) return input.length;
        return Object.keys(input).length;
    }

//fn:replace(inputString, beforeSubstring, afterSubstring) → String
    function replace(inputString, beforeSubstring, afterSubstring) {
        beforeSubstring = beforeSubstring || "";
        afterSubstring = afterSubstring || "";
        if (!inputString) return inputString;
        var buffer = "", bl = beforeSubstring.length, str = inputString, idx = -1;

        while (~(idx = str.indexOf(beforeSubstring))) {
            buffer += str.substring(0, idx) + afterSubstring;
            str = str.substring(idx + bl);
        }
        return buffer + str;

    }

//fn:split(string, delimiters) → String[]
    function split(str, delimiters) {
        if (str === null || str === undefined || str.length === 0) str = '';
        if (delimiters === null || delimiters === undefined) delimiters = '';
        return str.split(delimiters);
    }

    function escapeXml(str) {
        if (!str)return str;
        var buffer = "";
        for (var i = 0, l = str.length; i < l; i++) {
            var chr = str[i];
            switch (chr) {
                case '<':
                    buffer += '&lt;';
                    break;
                case '>':
                    buffer += '&gt;';
                    break;
                case '&':
                    buffer += '&amp;';
                    break;
                case '"':
                    buffer += '&#034;';
                    break;
                case '\'':
                    buffer += '&#039;';
                    break;
                default:
                    buffer += chr;
            }
        }
        return buffer;
    }
    function toLowerCase(str){
        return str && str.toLowerCase();
    }
    function toUpperCase(str){
        return str && str.toUpperCase();
    }
    function trim(str){
        return str && (""+str).replace(/^\s+|\s+$/g,'');
    }
    var obj = {};
    //content goes here  version
    //org.apache.taglibs.standard.functions.Functions
    //boolean contains(java.lang.String, java.lang.String)
    /*
     EXAMPLE:
     <c:if test="${fn:contains(name, searchString)}">

     */
    obj['contains'] = contains;

    //org.apache.taglibs.standard.functions.Functions
    //boolean containsIgnoreCase(java.lang.String, java.lang.String)
    /*
     EXAMPLE:
     <c:if test="${fn:containsIgnoreCase(name, searchString)}">

     */
    obj['containsIgnoreCase'] = containsIgnoreCase;

    //org.apache.taglibs.standard.functions.Functions
    //boolean endsWith(java.lang.String, java.lang.String)
    /*
     EXAMPLE:
     <c:if test="${fn:endsWith(filename, ".txt")}">

     */
    obj['endsWith'] = endsWith;

    //org.apache.taglibs.standard.functions.Functions
    //java.lang.String escapeXml(java.lang.String)
    /*
     EXAMPLE:
     ${fn:escapeXml(param:info)}

     */
    obj['escapeXml'] = escapeXml;

    //org.apache.taglibs.standard.functions.Functions
    //int indexOf(java.lang.String, java.lang.String)
    /*
     EXAMPLE:
     ${fn:indexOf(name, "-")}

     */
    obj['indexOf'] = indexOf;

    //org.apache.taglibs.standard.functions.Functions
    //java.lang.String join(java.lang.String[], java.lang.String)
    /*
     EXAMPLE:
     ${fn:join(array, ";")}

     */
    obj['join'] = join;

    //org.apache.taglibs.standard.functions.Functions
    //int length(java.lang.Object)
    /*
     EXAMPLE:
     You have ${fn:length(shoppingCart.products)} in your shopping cart.

     */
    obj['length'] = length;

    //org.apache.taglibs.standard.functions.Functions
    //java.lang.String replace(java.lang.String, java.lang.String, java.lang.String)
    /*
     EXAMPLE:
     ${fn:replace(text, "-", "")}

     */
    obj['replace'] = replace;

    //org.apache.taglibs.standard.functions.Functions
    //java.lang.String[] split(java.lang.String, java.lang.String)
    /*
     EXAMPLE:
     ${fn:split(customerNames, ";")}

     */
    obj['split'] = split

    //org.apache.taglibs.standard.functions.Functions
    //boolean startsWith(java.lang.String, java.lang.String)
    /*
     EXAMPLE:
     <c:if test="${fn:startsWith(product.id, "100-")}">

     */
    obj['startsWith'] = startsWith;

    //org.apache.taglibs.standard.functions.Functions
    //java.lang.String substring(java.lang.String, int, int)
    /*
     EXAMPLE:
     P.O. Box: ${fn:substring(zip, 6, -1)}

     */
    function substring(str, s, e) {
        return str && str.substring(s, e);
    };
    obj['substring'] = substring;
    //org.apache.taglibs.standard.functions.Functions
    //java.lang.String substringAfter(java.lang.String, java.lang.String)
    /*
     EXAMPLE:
     P.O. Box: ${fn:substringAfter(zip, "-")}

     */
    obj['substringAfter'] = function (str, idx) {
        return str && substring(indexOf(idx), str.length);
    }

    //org.apache.taglibs.standard.functions.Functions
    //java.lang.String substringBefore(java.lang.String, java.lang.String)
    /*
     EXAMPLE:
     Zip (without P.O. Box): ${fn:substringBefore(zip, "-")}

     */
    obj['substringBefore'] = function () {
        //content goes here
        console.log('contains:substringBefore is not implemented ');
    }

    //org.apache.taglibs.standard.functions.Functions
    //java.lang.String toLowerCase(java.lang.String)
    /*
     EXAMPLE:
     Product name: ${fn.toLowerCase(product.name)}

     */
    obj['toLowerCase'] = toLowerCase;
    //org.apache.taglibs.standard.functions.Functions
    //java.lang.String toUpperCase(java.lang.String)
    /*
     EXAMPLE:
     Product name: ${fn.UpperCase(product.name)}

     */
    obj['toUpperCase'] = toUpperCase;

    //org.apache.taglibs.standard.functions.Functions
    //java.lang.String trim(java.lang.String)
    /*
     EXAMPLE:
     Name: ${fn.trim(name)}

     */
    obj['trim'] = trim;

    return obj;
});
            