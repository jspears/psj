/**
 * Module dependencies.
 */

var express = require('express'), http = require('http');

var app = express();

// all environments
app.set('port', process.env.PORT || 8000);
app.use(express.static(__dirname + '/public'));
app.get('/index', function (req, res) {
    return res.send({
        title: 'JSP Demo App',
        requestScope: {
            people: [
                {id: 1, name: 'Joe', description: 'Nice Guy'},
                {id: 2, name: 'Bob', description: 'really great dude!'}
            ]
        }
    });
})
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
