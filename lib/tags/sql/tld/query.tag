<%--
        Executes the SQL query defined in its body or through the
        sql attribute.
    --%>
<%@attribute rtexprvalue="false" required="true" name="var" description=" Name of the exported scoped variable for the query result. The type of the scoped variable is javax.servlet.jsp.jstl.sql. Result (see Chapter 16 "Java APIs").         " %>
<%@attribute rtexprvalue="false" required="false" name="scope" description=" Scope of var.         " %>
<%@attribute rtexprvalue="true" required="false" name="sql" description=" SQL query statement.         " %>
<%@attribute rtexprvalue="true" required="false" name="dataSource" description=" Data source associated with the database to query. A String value represents a relative path to a JNDI resource or the parameters for the DriverManager class.         " %>
<%@attribute rtexprvalue="true" required="false" name="startRow" description=" The returned Result object includes the rows starting at the specified index. The first row of the original query result set is at index 0. If not specified, rows are included starting from the first row at index 0.         " %>
<%@attribute rtexprvalue="true" required="false" name="maxRows" description=" The maximum number of rows to be included in the query result. If not specified, or set to -1, no limit on the maximum number of rows is enforced.         " %>
<%
            console.log('please implement: "http://java.sun.com/jsp/jstl/sql:query"');
            %>