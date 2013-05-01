#A Pure JS implementation of JSP.
Giving it a go.   I think JSP2 got a lot right, particularly in the .tag file bit. It does something that most template engines in
javascript land fail miserable at, including other templates.   So this is my attempt of implementing a JSP template engine
in JS.   It's mostly working.  Have a bunch of tags to write, but for the most part it should be working.

#Usage:
see example/app.js

#State:
##Working so far:
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

##Not implemented:
* &gt;jsp:attribute&lt;
* all the rest of the tags.
* bootstrapping for client side JSP rendering.




##Ideas:
* Implement Angular like data binding for models.  Particularly backbone view/models.
* Create a server side parser in node so that clients never have to compile templates only
  recieve the function.

