<%@attribute name="value" required="false"%>
<%@attribute name="escapeXml" required="false" type="bool"%>
<%@attribute name="default" required="false" %>
<%@taglib prefix="f"  uri="http://java.sun.com/jsp/jstl/functions" %>
<%= (value || default)   %>