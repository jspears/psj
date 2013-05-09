<%--
        Stores the given locale in the locale configuration variable
    --%>
<%@attribute rtexprvalue="true" required="true" name="value" description=" A String value is interpreted as the printable representation of a locale, which must contain a two-letter (lower-case) language code (as defined by ISO-639), and may contain a two-letter (upper-case) country code (as defined by ISO-3166). Language and country codes must be separated by hyphen (-) or underscore (_).         	" %>
<%@attribute rtexprvalue="true" required="false" name="variant" description=" Vendor- or browser-specific variant. See the java.util.Locale javadocs for more information on variants.         " %>
<%@attribute rtexprvalue="false" required="false" name="scope" description=" Scope of the locale configuration variable.         " %>
<%
            console.log('please implement: "http://java.sun.com/jsp/jstl/fmt:setLocale"');
            %>