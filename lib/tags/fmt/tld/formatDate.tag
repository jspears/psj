<%--
        Formats a date and/or time using the supplied styles and pattern
    --%>
<%@attribute rtexprvalue="true" required="true" name="value" description=" Date and/or time to be formatted.         " %>
<%@attribute rtexprvalue="true" required="false" name="type" description=" Specifies whether the time, the date, or both the time and date components of the given date are to be formatted.          " %>
<%@attribute rtexprvalue="true" required="false" name="dateStyle" description=" Predefined formatting style for dates. Follows the semantics defined in class java.text.DateFormat. Applied only when formatting a date or both a date and time (i.e. if type is missing or is equal to "date" or "both"); ignored otherwise.         " %>
<%@attribute rtexprvalue="true" required="false" name="timeStyle" description=" Predefined formatting style for times. Follows the semantics defined in class java.text.DateFormat. Applied only when formatting a time or both a date and time (i.e. if type is equal to "time" or "both"); ignored otherwise.         " %>
<%@attribute rtexprvalue="true" required="false" name="pattern" description=" Custom formatting style for dates and times.         " %>
<%@attribute rtexprvalue="true" required="false" name="timeZone" description=" Time zone in which to represent the formatted time.         " %>
<%@attribute rtexprvalue="false" required="false" name="var" description=" Name of the exported scoped variable which stores the formatted result as a String.         " %>
<%@attribute rtexprvalue="false" required="false" name="scope" description=" Scope of var.         " %>
<%
            console.log('please implement: "http://java.sun.com/jsp/jstl/fmt:formatDate"');
            %>