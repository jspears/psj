<%--
        Maps key to localized message and performs parametric replacement
    --%>
<%@attribute rtexprvalue="true" required="false" name="key" description=" Message key to be looked up.         " %>
<%@attribute rtexprvalue="true" required="false" name="bundle" description=" Localization context in whose resource bundle the message key is looked up.         " %>
<%@attribute rtexprvalue="false" required="false" name="var" description=" Name of the exported scoped variable which stores the localized message.         " %>
<%@attribute rtexprvalue="false" required="false" name="scope" description=" Scope of var.         " %>
<%
            console.log('please implement: "http://java.sun.com/jsp/jstl/fmt:message"');
            %>