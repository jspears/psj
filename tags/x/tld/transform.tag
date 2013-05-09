<%--
	Conducts a transformation given a source XML document
	and an XSLT stylesheet
    --%>
<%@attribute rtexprvalue="false" required="false" name="var" description=" Name of the exported scoped variable for the transformed XML document. The type of the scoped variable is org.w3c.dom.Document.         " %>
<%@attribute rtexprvalue="false" required="false" name="scope" description=" Scope for var.         " %>
<%@attribute rtexprvalue="true" required="false" name="result" description=" Result Object that captures or processes the transformation result.         " %>
<%@attribute rtexprvalue="true" required="false" name="xml" description=" Deprecated. Use attribute 'doc' instead.         " %>
<%@attribute rtexprvalue="true" required="false" name="doc" description=" Source XML document to be transformed. (If exported by <x:set>, it must correspond to a well-formed XML document, not a partial document.)         " %>
<%@attribute rtexprvalue="true" required="false" name="xmlSystemId" description=" Deprecated. Use attribute 'docSystemId' instead.         " %>
<%@attribute rtexprvalue="true" required="false" name="docSystemId" description=" The system identifier (URI) for parsing the XML document.         " %>
<%@attribute rtexprvalue="true" required="false" name="xslt" description=" javax.xml.transform.Source Transformation stylesheet as a String, Reader, or Source object.         " %>
<%@attribute rtexprvalue="true" required="false" name="xsltSystemId" description=" The system identifier (URI) for parsing the XSLT stylesheet.         " %>
<%
            console.log('please implement: "http://java.sun.com/jsp/jstl/xml:transform"');
            %>