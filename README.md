#A Pure JS implementation of JSP.
Giving it a go.   I think JSP2.2 got a lot right, particularly in the *.tag file bit. Something that most template engines in
javascript land fail miserable at, including other templates.   So this is my attempt of implementing a JSP template engine
in JS.   Not working yet, the parser is almost there.  Went with a linear string scan for simplicity and speed, though I am
sure it has "issues".   The idea being you can take your JSP, port them to node and everything except the Java based scriptlets.
should more or less work.   Note

##Usage: No usage yet see JSP - work in progress.

##Ideas:
* Implement Angular like data binding for models.  Particularly backbone view/models.
* Create a server side parser in node so that clients never have to compile templates only
  recieve the function.