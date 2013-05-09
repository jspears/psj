<%--
        Executes the SQL update defined in its body or through the
        sql attribute.
    --%>
<%@attribute rtexprvalue="false" required="false" name="var" description=" Name of the exported scoped variable for the result of the database update. The type of the scoped variable is java.lang.Integer.         " %>
<%@attribute rtexprvalue="false" required="false" name="scope" description=" Scope of var.         " %>
<%@attribute rtexprvalue="true" required="false" name="sql" description=" SQL update statement.         " %>
<%@attribute rtexprvalue="true" required="false" name="dataSource" description=" Data source associated with the database to update. A String value represents a relative path to a JNDI resource or the parameters for the JDBC DriverManager class.         " %>
<%
            console.log('please implement: "http://java.sun.com/jsp/jstl/sql:update"');
            %>