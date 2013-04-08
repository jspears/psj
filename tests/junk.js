var Context = require('./psj-test-context');
var ctx = new Context();
var res = ctx.parse('<body/>');
console.log('res', res);