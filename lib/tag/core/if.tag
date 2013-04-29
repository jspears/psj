<%@attribute name="test" rtexprvalue="true" required="true" %>

<%
 console.log('test value', test);
 if(!(test === void(0) || test === null || test === false || test === '')){ %>
    <jsp:doBody/>
<% } %>