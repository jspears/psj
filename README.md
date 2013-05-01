#A Pure JS implementation of JSP.
Giving it a go.   I think JSP2.2 got a lot right, particularly in the *.tag file bit. Something that most template engines in
javascript land fail miserable at, including other templates.   So this is my attempt of implementing a JSP template engine
in JS.   It's mostly working.  Have a bunch of tags to write, but for the most part it should be working.

##Usage: No usage yet see JSP - work in progress.
So there is an example sort of app.js, going to rework these bits move it all to an example directory.


Working so far:
*Express Plugin
*c:forEach
*c:set
*c:if
*c:choose
*c:when
*c:otherwise
*scriptless
*JSP EL
*tag attributes.

Not implemented:
* &gt;jsp:attribute&lt;
* all the rest of the tags.
* bootstrapping for client side functionality.



##Ideas:
* Implement Angular like data binding for models.  Particularly backbone view/models.
* Create a server side parser in node so that clients never have to compile templates only
  recieve the function.

