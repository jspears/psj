<%@attribute name="var" required="true" rtexprvalue="true"%>
<%@attribute name="value" required="true" rtexprvalue="true"%>
<%@attribute name="scope" required="false" rtexprvalue="false"%>
<%
    var scopeName = (attr.scope || 'page')+'Scope';
    scope[scopeName] = attr.value;

%>