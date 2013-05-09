<%--
	Simple conditional tag, which evalutes its body if the
	supplied condition is true and optionally exposes a Boolean
	scripting variable representing the evaluation of this condition
--%>
<%@attribute type="boolean" rtexprvalue="true" required="true" name="test" description=" The test condition that determines whether or not the body content should be processed.         " %>
<%@attribute rtexprvalue="false" required="false" name="var" description=" Name of the exported scoped variable for the resulting value of the test condition. The type of the scoped variable is Boolean.                 " %>
<%@attribute rtexprvalue="false" required="false" name="scope" description=" Scope for var.         " %>
<%
 if(!(test === void(0) || test === null || test === false || test === '')){ %>
    <jsp:doBody/>
<% } %>