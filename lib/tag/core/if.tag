<%@attribute name="test" rtexprvalue="true" required="true" %>
<% if(test !== undefined && test !== null && test !== false ){ %>
    <jsp:doBody/>
<% } %>