<%--
        Loads a resource bundle to be used by its tag body
    --%>
<%@attribute rtexprvalue="true" required="true" name="basename" description=" Resource bundle base name. This is the bundle's fully-qualified resource name, which has the same form as a fully-qualified class name, that is, it uses "." as the package component separator and does not have any file type (such as ".class" or ".properties") suffix.         " %>
<%@attribute rtexprvalue="true" required="false" name="prefix" description=" Prefix to be prepended to the value of the message key of any nested <fmt:message> action.         " %>
<%
            console.log('please implement: "http://java.sun.com/jsp/jstl/fmt:bundle"');
            %>