require(['jquery','underscore', 'backbone', 'psj-remote-resolver', 'psj-parsed-functions-remote'], function ($, _, B, resolver) {
    require(['../psj-context'], function (Context) {
        var AppRouter = B.Router.extend({
            routes: {
                "*actions": "defaultRoute" // matches http://example.com/#anything-here
            }
        });
        // Initiate the router
        var app_router = new AppRouter;
        var cache = {};

        function write(e, o) {
            document.write(o);
        }

        function renderWrite(resp) {
            this.render(resp, write);
        }

        function render(psj, path) {
            return $.ajax({url: path.replace(/\.jsp$/, ''), success: _.bind(renderWrite, psj)});
        }

        app_router.on('route:defaultRoute', function (actions) {
            console.log('alert ', actions);
            if (!actions) actions = 'index.jsp';
            if (cache[actions]) {
                render(cache[actions], actions);
            } else {
                require(['text!jsp/views/' + actions], function (content) {
                    console.log('found', content);
                    var psj = cache[actions] = (function (content) {
                        var ctx = new Context(null, null, resolver, actions);
                        ctx.parse(content);
                        return ctx;
                    })(content);
                    render(psj, actions);
                });
            }
        })

        // Start Backbone history a necessary step for bookmarkable URL's
        Backbone.history.start();
        return {app_router: app_router};
    })
});