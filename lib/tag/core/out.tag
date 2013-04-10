<%@attribute name="value" require="false"%>
<%@attribute name="escapeXml" required="false" type="bool"%>
<%@attribute name="default" required="false" %>
<%@taglib prefix="f"  uri="http://java.sun.com/jsp/jstl/functions" %>
<%=  escapeXml == false ? value || defaultValue : f:escapeXml(value || default)   %>