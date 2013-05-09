<%--
        Retrieves an absolute or relative URL and exposes its contents
        to either the page, a String in 'var', or a Reader in 'varReader'.
    --%>
<%@attribute rtexprvalue="true" required="true" name="url" description=" The URL of the resource to import.         " %>
<%@attribute rtexprvalue="false" required="false" name="var" description=" Name of the exported scoped variable for the resource's content. The type of the scoped variable is String.         " %>
<%@attribute rtexprvalue="false" required="false" name="scope" description=" Scope for var.         " %>
<%@attribute rtexprvalue="false" required="false" name="varReader" description=" Name of the exported scoped variable for the resource's content. The type of the scoped variable is Reader.         " %>
<%@attribute rtexprvalue="true" required="false" name="context" description=" Name of the context when accessing a relative URL resource that belongs to a foreign context.         " %>
<%@attribute rtexprvalue="true" required="false" name="charEncoding" description=" Character encoding of the content at the input resource.         " %>
<%
            console.log('please implement: "http://java.sun.com/jsp/jstl/core:import"');
            %>