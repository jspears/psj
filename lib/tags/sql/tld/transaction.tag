<%--
        Provides nested database action elements with a shared Connection,
        set up to execute all statements as one transaction.
    --%>
<%@attribute rtexprvalue="true" required="false" name="dataSource" description=" DataSource associated with the database to access. A String value represents a relative path to a JNDI resource or the parameters for the JDBC DriverManager facility.         " %>
<%@attribute rtexprvalue="true" required="false" name="isolation" description=" Transaction isolation level. If not specified, it is the isolation level the DataSource has been configured with.         " %>
<%
            console.log('please implement: "http://java.sun.com/jsp/jstl/sql:transaction"');
            %>