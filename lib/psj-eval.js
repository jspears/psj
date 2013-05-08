if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}
define(['./text-util'], function (tu) {
    var lt = tu.l_test, rt = tu.r_test, mf = tu.match_fwd;

    function PSJEval(content) {
        var buffer = "";
        var state = 0;
        for (var i = 0, l = content.length; i < l; i++) {
            if (state === 1) {
                state = 0;
                buffer += "_";

            }
            if (lt(content, i) && mf(content, i + 1, 'default') && rt(content, i + 9)) {
                state = 1;
            }
            buffer += content[i];
        }
        this.content = buffer;
    }

    PSJEval.prototype.create = function () {
        var content = this.content;
        return function evaluate(ctx) {
            return content;
        }
    }
    return PSJEval;
});