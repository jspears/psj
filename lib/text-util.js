var el_reserved = 'and eq gt true instanceof or ne le false empty not lt ge null div mod'.split(' ');
var js_reserved = 'break case catch continue debugger default delete do else finally for function if in instanceof new return switch this throw try typeof var void while with';
var js_reserved_delta = js_reserved.split(' ').filter(function (v) {
    return !~el_reserved.indexOf(v)
});



function whitespace(c) {

    switch (c.charCodeAt(0)) {
        case 32:
            return true;
        case 12:
            return true;
        case 10:
            return true;
        case 13:
            return true;
        case 9:
            return true;
        case 11:
            return true;
        case 160:
            return true;
        case 8232:
            return true;
        case 8233:
            return true;
    }
    return false;
}
function l_test(str, c){
    if (whitespace_at(str,c))
        return true;
    return str.charAt(c) === '(';
}
function r_test(str, c){
    if (whitespace_at(str,c))
        return true;
    return str.charAt(c) === ')';
}
function whitespace_at(str, c){
    switch (str.charCodeAt(c)) {
        case 32:
            return true;
        case 12:
            return true;
        case 10:
            return true;
        case 13:
            return true;
        case 9:
            return true;
        case 11:
            return true;
        case 160:
            return true;
        case 8232:
            return true;
        case 8233:
            return true;
    }
    return false;

}
function countLines(str, to) {
    for (var i = 0, lines = 0, l = Math.min(str.length, to); i < l; i++) {
        if (str[i] === '\n') lines++;
    }
    return lines;
}

/**
 * Looks for the next whitespace from the index.  returns
 * the position of the first not white space found. or idx
 * if no whitepace is found.
 * @param str
 * @param idx
 * @returns (Number) index
 */
function whitespace_offset(str, idx) {
    for (var i = idx, l = str.length; i < l; i++)
        if (whitespace(str[i])) return i;
    return idx;
}

function whitespace_swallow(str, idx) {
    if (str === undefined) return idx;
    var l = str.length;
    while (l < idx && whitespace(str[idx])) idx++
    return idx;
}

function match_fwd_idx(str, idx, match) {
    for (var i = 0, l = match.length; i < l; i++, idx++)
        if (str[idx] !== match[i]) break;
    return idx;
}

function match_fwd(str, idx, match) {
    for (var i = 0, l = match.length; i < l; i++)
        if (str[idx + i] !== match[i]) return false;
    return true;
}

function match_bkwd(str, idx, match) {
    for (var i = match.length - 1; i > -1; i--, idx--) {
        if (str[idx] !== match[i]) return false;
    }
    return true;
}

function trim_end(str, count) {
    var buf = "";
    for (var i = 0, l = str.length - count; i < l; i++)
        buf += str[i];

    return buf;
}
var identRe = /[a-zA-Z0-9_$]/;
function identifier(str, idx){

    for(var l=str.length;idx<l;idx++){
       if (!identRe.test(str[idx]))
            return idx;
    }
    return idx;
}

//" \n\t\s\r\s~!@%^&*(){}\|':;'\"<>./?[]+=-"
//consider breaking this up char <58 char < 65
//performance test nested switch vs flat switch vs nested if vs nested switch+if
function specialChars(str, i) {
    switch (str.charCodeAt(i)) {
        case 9:
            return true;
        case 10:
            return true;
        case 13:
            return true;
        case 32:
            return true;
        case 33:
            return true;
        case 34:
            return true;
        case 37:
            return true;
        case 38:
            return true;
        case 39:
            return true;
        case 39:
            return true;
        case 40:
            return true;
        case 41:
            return true;
        case 42:
            return true;
        case 43:
            return true;
        case 45:
            return true;
        case 46:
            return true;
        case 47:
            return true;
        case 58:
            return true;
        case 59:
            return true;
        case 60:
            return true;
        case 61:
            return true;
        case 62:
            return true;
        case 63:
            return true;
        case 64:
            return true;
        case 91:
            return true;
        case 93:
            return true;
        case 94:
            return true;
        case 115:
            return true;
        case 123:
            return true;
        case 124:
            return true;
        case 125:
            return true;
        case 126:
            return true;
    }
    return false;
};
var java_reserved = 'abstract continue for new switch assert default goto* package synchronized boolean do if private this'+
'break double implements	protected	throw byte	else	import	public	throws case	enum instanceof return transient'+
'catch extends int	short	try  char	final	interface	static	void class	finally	long	strictfp	volatile const	float	native	super	while'

module.exports = {
    trim_end: trim_end,
    match_bkwd: match_bkwd,
    match_fwd: match_fwd,
    match_fwd_idx: match_fwd_idx,
    whitespace_offset: whitespace_offset,
    whitespace: whitespace,
    whitespace_swallow: whitespace_swallow,
    countLines: countLines,
    specialChars: specialChars,
    whitespace_at:whitespace_at,
    l_test:l_test,
    r_test:r_test,
    identifier:identifier,
    el_reserved:el_reserved,
    js_reserved:js_reserved,
    js_reserved_delta:js_reserved_delta
}