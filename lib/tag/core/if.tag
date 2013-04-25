<%@attribute name="test" rtexprvalue="true" required="true" %>
<% if(test){ %>
    debugger;
    <jsp:doBody/>
<% } %>