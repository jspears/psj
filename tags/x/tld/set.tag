<%--
	Saves the result of an XPath expression evaluation in a 'scope'
    --%>
<%@attribute rtexprvalue="false" required="true" name="var" description=" Name of the exported scoped variable to hold the value specified in the action. The type of the scoped variable is whatever type the select expression evaluates to.         " %>
<%@attribute rtexprvalue="false" required="false" name="select" description=" XPath expression to be evaluated.         " %>
<%@attribute rtexprvalue="false" required="false" name="scope" description=" Scope for var.         " %>
<%
            console.log('please implement: "http://java.sun.com/jsp/jstl/xml:set"');
            %>