<%--
        XML conditional tag, which evalutes its body if the
        supplied XPath expression evalutes to 'true' as a boolean
    --%>
<%@attribute rtexprvalue="false" required="true" name="select" description=" The test condition that tells whether or not the body content should be processed.         " %>
<%@attribute rtexprvalue="false" required="false" name="var" description=" Name of the exported scoped variable for the resulting value of the test condition. The type of the scoped variable is Boolean.         " %>
<%@attribute rtexprvalue="false" required="false" name="scope" description=" Scope for var.         " %>
<%
            console.log('please implement: "http://java.sun.com/jsp/jstl/xml:if"');
            %>