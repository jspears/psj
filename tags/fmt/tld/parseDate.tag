<%--
        Parses the string representation of a date and/or time
    --%>
<%@attribute rtexprvalue="true" required="false" name="value" description=" Date string to be parsed.         " %>
<%@attribute rtexprvalue="true" required="false" name="type" description=" Specifies whether the date string in the value attribute is supposed to contain a time, a date, or both.         " %>
<%@attribute rtexprvalue="true" required="false" name="dateStyle" description=" Predefined formatting style for days which determines how the date component of the date string is to be parsed. Applied only when formatting a date or both a date and time (i.e. if type is missing or is equal to "date" or "both"); ignored otherwise.         " %>
<%@attribute rtexprvalue="true" required="false" name="timeStyle" description=" Predefined formatting styles for times which determines how the time component in the date string is to be parsed. Applied only when formatting a time or both a date and time (i.e. if type is equal to "time" or "both"); ignored otherwise.         " %>
<%@attribute rtexprvalue="true" required="false" name="pattern" description=" Custom formatting pattern which determines how the date string is to be parsed.         " %>
<%@attribute rtexprvalue="true" required="false" name="timeZone" description=" Time zone in which to interpret any time information in the date string.         " %>
<%@attribute rtexprvalue="true" required="false" name="parseLocale" description=" Locale whose predefined formatting styles for dates and times are to be used during the parse operation, or to which the pattern specified via the pattern attribute (if present) is applied.         " %>
<%@attribute rtexprvalue="false" required="false" name="var" description=" Name of the exported scoped variable in which the parsing result (of type java.util.Date) is stored.         " %>
<%@attribute rtexprvalue="false" required="false" name="scope" description=" Scope of var.         " %>
<%
            console.log('please implement: "http://java.sun.com/jsp/jstl/fmt:parseDate"');
            %>