<%--
        Formats a numeric value as a number, currency, or percentage
    --%>
<%@attribute rtexprvalue="true" required="false" name="value" description=" Numeric value to be formatted.         " %>
<%@attribute rtexprvalue="true" required="false" name="type" description=" Specifies whether the value is to be formatted as number, currency, or percentage.         " %>
<%@attribute rtexprvalue="true" required="false" name="pattern" description=" Custom formatting pattern.         " %>
<%@attribute rtexprvalue="true" required="false" name="currencyCode" description=" ISO 4217 currency code. Applied only when formatting currencies (i.e. if type is equal to "currency"); ignored otherwise.         " %>
<%@attribute rtexprvalue="true" required="false" name="currencySymbol" description=" Currency symbol. Applied only when formatting currencies (i.e. if type is equal to "currency"); ignored otherwise.         " %>
<%@attribute rtexprvalue="true" required="false" name="groupingUsed" description=" Specifies whether the formatted output will contain any grouping separators.         " %>
<%@attribute rtexprvalue="true" required="false" name="maxIntegerDigits" description=" Maximum number of digits in the integer portion of the formatted output.         " %>
<%@attribute rtexprvalue="true" required="false" name="minIntegerDigits" description=" Minimum number of digits in the integer portion of the formatted output.         " %>
<%@attribute rtexprvalue="true" required="false" name="maxFractionDigits" description=" Maximum number of digits in the fractional portion of the formatted output.         " %>
<%@attribute rtexprvalue="true" required="false" name="minFractionDigits" description=" Minimum number of digits in the fractional portion of the formatted output.         " %>
<%@attribute rtexprvalue="false" required="false" name="var" description=" Name of the exported scoped variable which stores the formatted result as a String.         " %>
<%@attribute rtexprvalue="false" required="false" name="scope" description=" Scope of var.         " %>
<%
            console.log('please implement: "http://java.sun.com/jsp/jstl/fmt:formatNumber"');
            %>