<%--
        Parses the string representation of a number, currency, or percentage
    --%>
<%@attribute rtexprvalue="true" required="false" name="value" description=" String to be parsed.         " %>
<%@attribute rtexprvalue="true" required="false" name="type" description=" Specifies whether the string in the value attribute should be parsed as a number, currency, or percentage.         " %>
<%@attribute rtexprvalue="true" required="false" name="pattern" description=" Custom formatting pattern that determines how the string in the value attribute is to be parsed.         " %>
<%@attribute rtexprvalue="true" required="false" name="parseLocale" description=" Locale whose default formatting pattern (for numbers, currencies, or percentages, respectively) is to be used during the parse operation, or to which the pattern specified via the pattern attribute (if present) is applied.         " %>
<%@attribute rtexprvalue="true" required="false" name="integerOnly" description=" Specifies whether just the integer portion of the given value should be parsed.         " %>
<%@attribute rtexprvalue="false" required="false" name="var" description=" Name of the exported scoped variable which stores the parsed result (of type java.lang.Number).         " %>
<%@attribute rtexprvalue="false" required="false" name="scope" description=" Scope of var.         " %>
<%
            console.log('please implement: "http://java.sun.com/jsp/jstl/fmt:parseNumber"');
            %>