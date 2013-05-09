<%--
	Parses XML content from 'source' attribute or 'body'
    --%>
<%@attribute rtexprvalue="false" required="false" name="var" description=" Name of the exported scoped variable for the parsed XML document. The type of the scoped variable is implementation dependent.         " %>
<%@attribute rtexprvalue="false" required="false" name="varDom" description=" Name of the exported scoped variable for the parsed XML document. The type of the scoped variable is org.w3c.dom.Document.         " %>
<%@attribute rtexprvalue="false" required="false" name="scope" description=" Scope for var.         " %>
<%@attribute rtexprvalue="false" required="false" name="scopeDom" description=" Scope for varDom.         " %>
<%@attribute rtexprvalue="true" required="false" name="xml" description=" Deprecated. Use attribute 'doc' instead.         " %>
<%@attribute rtexprvalue="true" required="false" name="doc" description=" Source XML document to be parsed.         " %>
<%@attribute rtexprvalue="true" required="false" name="systemId" description=" The system identifier (URI) for parsing the XML document.         " %>
<%@attribute rtexprvalue="true" required="false" name="filter" description=" Filter to be applied to the source document.         " %>
<%
            console.log('please implement: "http://java.sun.com/jsp/jstl/xml:parse"');
            %>