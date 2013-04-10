function whitespace(c) {
    switch(c){
        case " " :return true;
        case "\t":return true;
        case "\r":return true;
        case "\n":return true;
    }
    return false;
}
function countLines(str, to){
    for(var i = 0, lines=0,l = Math.min(str.length, to); i<l;i++){
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
    for (var i=idx, l = str.length; i < l; i++)
        if (whitespace(str[i])) return i;
    return idx;
}
function whitespace_swallow(str, idx){
    while(whitespace(str[idx])) idx++
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

module.exports = {
    trim_end: trim_end,
    match_bkwd: match_bkwd,
    match_fwd: match_fwd,
    match_fwd_idx: match_fwd_idx,
    whitespace_offset: whitespace_offset,
    whitespace: whitespace,
    whitespace_swallow:whitespace_swallow,
    countLines:countLines
}