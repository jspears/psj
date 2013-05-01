<%@taglib prefix="c"  uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="example" tagdir="/WEB-INF/tags"%>
    <!DOCTYPE html>
    <html>
    <head>
    <title>hello world</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Bootstrap -->
    <link href="css/bootstrap.min.css" rel="stylesheet" media="screen">
    <link href="css/bootstrap-responsive.css" rel="stylesheet">
    <style type="text/css">
    body {
    padding-top: 20px;
    padding-bottom: 40px;
    }

    /* Custom container */
    .container-narrow {
    margin: 0 auto;
    max-width: 700px;
    }
    .container-narrow > hr {
    margin: 30px 0;
    }

    /* Main marketing message and sign up button */
    .jumbotron {
    margin: 60px 0;
    text-align: center;
    }
    .jumbotron h1 {
    font-size: 72px;
    line-height: 1;
    }
    .jumbotron .btn {
    font-size: 21px;
    padding: 14px 24px;
    }

    /* Supporting marketing content */
    .marketing {
    margin: 60px 0;
    }
    .marketing p + h4 {
    margin-top: 28px;
    }
    </style>
    </head>
    <body>
    <div class="container-narrow">
    <div class="masthead">

    <h3 class="muted">PSJ Hello World!</h3>
    </div>
    <div class="jumbotron">
    <h1>hello el expression ${title}!</h1>

    <p class="lead">Just a test page</p>
    <example:people people="${people}"/>
    </div>

    </body>
    </html>

