<%--
        Loads a resource bundle and stores it in the named scoped variable or
        the bundle configuration variable
    --%>
<%@attribute rtexprvalue="true" required="true" name="basename" description=" Resource bundle base name. This is the bundle's fully-qualified resource name, which has the same form as a fully-qualified class name, that is, it uses "." as the package component separator and does not have any file type (such as ".class" or ".properties") suffix.         " %>
<%@attribute rtexprvalue="false" required="false" name="var" description=" Name of the exported scoped variable which stores the i18n localization context of type javax.servlet.jsp.jstl.fmt.LocalizationC ontext.         " %>
<%@attribute rtexprvalue="false" required="false" name="scope" description=" Scope of var or the localization context configuration variable.         " %>
<%
            console.log('please implement: "http://java.sun.com/jsp/jstl/fmt:setBundle"');
            %>