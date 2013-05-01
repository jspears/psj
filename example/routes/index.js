/*
 * GET home page.
 */

exports.index = function (req, res) {
    res.render('index', { title: 'JSP Demo App',
        requestScope: {
            people: [
                {
                    name: 'John Smith',
                    description: 'Very cool guy'
                },
                {
                    name: 'Bob Jones',
                    description: 'another "cool" guy'
                }

            ]
        }
    });
}