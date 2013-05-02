<%@taglib prefix="c"  uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="example" tagdir="/WEB-INF/tags"%>
<%@taglib prefix="funky" tagdir="/functions/string"%>
    <!DOCTYPE html>
    <html>
    <head>
    <title>hello world</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Bootstrap -->
    <link href="css/bootstrap.min.css" rel="stylesheet" media="screen">
    <link href="css/bootstrap-responsive.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">
    </head>
    <body>
    <div class="container-narrow">
    <div class="masthead">

    <h3 class="muted">PSJ Hello World!</h3>
    </div>
    <div class="jumbotron">
    <h1>hello el expression ${funky:capitalize(title)}!</h1>

    <p class="lead">Just a test page</p>
    <example:people people="${people}"/>
    </div>

    </body>
    </html>

