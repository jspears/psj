if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}
define(['underscore'], function (_) {
    var scopeNames = ['application', 'session', 'request', 'page'].map(function (v) {
        return v + 'Scope';
    });

    function Scope(evalScope) {
        evalScope = evalScope && evalScope.scope || evalScope || {};
        var pageScope = _.omit.apply(_, [evalScope].concat(scopeNames));
        this.scope = {
            pageScope: pageScope,
            requestScope: evalScope.requestScope || {},
            sessionScope: evalScope.sessionScope || {},
            applicationScope: evalScope.sessionScope || {}
        }
    }

    Scope.prototype.eval = function (f, ctx) {
        ctx = ctx || this;
        try {
            return f.call(ctx, this.asContext());
        } catch (e) {
            console.error('Scope -> error evaluating ', ctx && ctx.filename, e.message);
            throw e;
        }
    };
    Scope.prototype.get = function (varName, scope) {
        if (scope) {
            return this.scope[scope][varName]
        }

        for (var i = scopeNames; i--;)
            if (varName in this.scope[scopeNames[i]])
                return this.scope[scopeNames[i]][varName];

        return void(0);
    };

    Scope.prototype.set = function (varName, value, scope) {
        scope = scope || 'pageScope';
        this.scope[scope][varName] = value;
    };

    Scope.prototype.delete = function (varName, value, scope) {
        scope = scope || 'pageScope';
        delete this.scope[scope][varName];
    };

    Scope.prototype.asContext = function () {
        var scopes = [
            {},
            this.scope //access requestScope.property.
        ].concat(scopeNames.map(function (v) {
                //flatten scope vars so they are easy to access
                return this[v];
            }, this.scope));


        return _.extend.apply(_, scopes);

    };

    return  Scope;
});