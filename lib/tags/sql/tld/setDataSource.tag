<%--
        Creates a simple DataSource suitable only for prototyping.
    --%>
<%@attribute rtexprvalue="false" required="false" name="var" description=" Name of the exported scoped variable for the data source specified. Type can be String or DataSource.         " %>
<%@attribute rtexprvalue="false" required="false" name="scope" description=" If var is specified, scope of the exported variable. Otherwise, scope of the data source configuration variable.         " %>
<%@attribute rtexprvalue="true" required="false" name="dataSource" description=" Data source. If specified as a string, it can either be a relative path to a JNDI resource, or a JDBC parameters string as defined in Section 10.1.1.         " %>
<%@attribute rtexprvalue="true" required="false" name="driver" description=" JDBC parameter: driver class name.         " %>
<%@attribute rtexprvalue="true" required="false" name="url" description=" JDBC parameter: URL associated with the database.         " %>
<%@attribute rtexprvalue="true" required="false" name="user" description=" JDBC parameter: database user on whose behalf the connection to the database is being made.         " %>
<%@attribute rtexprvalue="true" required="false" name="password" description=" JDBC parameter: user password         " %>
<%
            console.log('please implement: "http://java.sun.com/jsp/jstl/sql:setDataSource"');
            %>