var Funcs = function () {
    this.contains = function (str, pattern) {
        return str && str.indexOf(pattern) > -1;
    }
    this.containsIgnoreCase = function (str, pattern) {
        return this.contains(str && str.toUpperCase(), pattern && pattern.toUpperCase());
    }

    this.startsWith = function (str, suffix) {
        if (!(str && suffix)) return false;
        return str.indexOf(suffix) === 0;
    }

    this.endsWith = function (str, postfix) {
        if (!(str && postfix)) return false;
        return str.lastIndexOf(postfix) === str.length - postfix.length;
    }

    this.indexOf = function (str, substring) {
        return str.indexOf(substring);
    }
    this.join = function (arr, seperator) {
        return arr && arr.join(seperator);
    }
    this.length = function (input) {
        if (!input) return 0;
        if (input.length) return input.length;
        return Object.keys(input).length;
    }
//fn:replace(inputString, beforeSubstring, afterSubstring) → String
    this.replace = function (inputString, beforeSubstring, afterSubstring) {
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
    this.split = function (str, delimiters) {
        if (str === null || str === undefined || str.length === 0) str = '';
        if (delimiters === null || delimiters === undefined) delimiters = '';
        return str.split(delimiters);
    }

    this.escapeXml = function (str) {
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

};
module.exports = new Funcs();