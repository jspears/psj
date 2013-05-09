<%--
	Iterates over tokens, separated by the supplied delimeters
    --%>
<%@attribute type="java.lang.String" rtexprvalue="true" required="true" name="items" description=" String of tokens to iterate over.         " %>
<%@attribute type="java.lang.String" rtexprvalue="true" required="true" name="delims" description=" The set of delimiters (the characters that separate the tokens in the string).         " %>
<%@attribute type="int" rtexprvalue="true" required="false" name="begin" description=" Iteration begins at the token located at the specified index. First token has index 0.         " %>
<%@attribute type="int" rtexprvalue="true" required="false" name="end" description=" Iteration ends at the token located at the specified index (inclusive).         " %>
<%@attribute type="int" rtexprvalue="true" required="false" name="step" description=" Iteration will only process every step tokens of the string, starting with the first one.         " %>
<%@attribute rtexprvalue="false" required="false" name="var" description=" Name of the exported scoped variable for the current item of the iteration. This scoped variable has nested visibility.         " %>
<%@attribute rtexprvalue="false" required="false" name="varStatus" description=" Name of the exported scoped variable for the status of the iteration. Object exported is of type javax.servlet.jsp.jstl.core.LoopTag Status. This scoped variable has nested visibility.         " %>
<%
            console.log('please implement: "http://java.sun.com/jsp/jstl/core:forTokens"');
            %>