        <%
this.contains = function(str, pattern){
    return str && str.indexOf(pattern) > -1;
}
this.containsIgnoreCase = function(str, pattern){
    return this.contains(str && str.toUpperCase(), pattern && pattern.toUpperCase());
}
this.endsWith = function(str, suffix){
    if (!(str && suffix)) return false;
    for (var i=str.length, j=suffix.length; i--&& j--;){
        if (str[i] !== suffix[j])
          return false;
    }
    return true;
}
this.indexOf = function(str, substring){
    return str.indexOf(substring);
}
this.join = function(arr, seperator){
    return arr && arr.join(seperator);
}
this.length = function(input){
    if (!input) return 0;
    if (input.length) return input.length;
    return Object.keys(input).length;
}
//fn:replace(inputString, beforeSubstring, afterSubstring) → String
this.replace = function(inputString, beforeSubstring, afterSubstring){
    beforeSubstring = beforeSubstring || "";
    afterSubstring = afterSubstring || "";
    if (!inputString) return inputString;
    var buffer = "";
    var bl = beforeSubstring.length, al = afterSubstring.length;
    for(var i=0;i<str.length;i++;){
        if (str.substring(i, i+bl) === beforeSubstring){
            buffer += afterSubstring;
            i+=al;
        }
    }
    return buffer;

}
//fn:split(string, delimiters) → String[]
this.split = function(str, delimiters){
    if (str === null|| str === undefined || str.length === 0) str=  '';
    if (delimiters === null || delimiters === undefined) delimiters = '';
    return str.split(delimiters);
}

this.escapeXml = function(str){
    if (!str)return str;
    var buffer = "";
    for(var i=0,l=str.length;i<l;i++){
        var chr= str[i];
        switch(chr){
            case '<':buffer+='&lt;'; break;
            case '>':buffer+='&gt;'; break;
            case '&':buffer+='&amp;';break;
            case '"':buffer+='&#034;';break;
            case '\'':buffer+='&#039;';break;
            default:buffer+=chr;
        }
    }
    return buffer;
}




%>