<%--
        Stores the given time zone in the time zone configuration variable
    --%>
<%@attribute rtexprvalue="true" required="true" name="value" description=" The time zone. A String value is interpreted as a time zone ID. This may be one of the time zone IDs supported by the Java platform (such as "America/Los_Angeles") or a custom time zone ID (such as "GMT-8"). See java.util.TimeZone for more information on supported time zone formats.         " %>
<%@attribute rtexprvalue="false" required="false" name="var" description=" Name of the exported scoped variable which stores the time zone of type java.util.TimeZone.         " %>
<%@attribute rtexprvalue="false" required="false" name="scope" description=" Scope of var or the time zone configuration variable.         " %>
<%
            console.log('please implement: "http://java.sun.com/jsp/jstl/fmt:setTimeZone"');
            %>