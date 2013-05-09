<%--
        Sets the result of an expression evaluation in a 'scope'
    --%>
<%@attribute rtexprvalue="false" required="false" name="var" description=" Name of the exported scoped variable to hold the value specified in the action. The type of the scoped variable is whatever type the value expression evaluates to.         " %>
<%@attribute rtexprvalue="true" required="false" name="value" description=" Expression to be evaluated.         " %>
<%@attribute rtexprvalue="true" required="false" name="target" description=" Target object whose property will be set. Must evaluate to a JavaBeans object with setter property property, or to a java.util.Map object.         " %>
<%@attribute rtexprvalue="true" required="false" name="property" description=" Name of the property to be set in the target object.         " %>
<%@attribute rtexprvalue="false" required="false" name="scope" description=" Scope for var.         " %>
<%

    var scopeName = (attr.scope || 'page')+'Scope';
    obj[scopeName][attr.var] = attr.value;
%>