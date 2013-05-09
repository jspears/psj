<%--
	XML iteration tag.
    --%>
<%@attribute rtexprvalue="false" required="false" name="var" description=" Name of the exported scoped variable for the current item of the iteration. This scoped variable has nested visibility. Its type depends on the result of the XPath expression in the select attribute.         " %>
<%@attribute rtexprvalue="false" required="true" name="select" description=" XPath expression to be evaluated.         " %>
<%@attribute type="int" rtexprvalue="true" required="false" name="begin" description=" Iteration begins at the item located at the specified index. First item of the collection has index 0.         " %>
<%@attribute type="int" rtexprvalue="true" required="false" name="end" description=" Iteration ends at the item located at the specified index (inclusive).         " %>
<%@attribute type="int" rtexprvalue="true" required="false" name="step" description=" Iteration will only process every step items of the collection, starting with the first one.         " %>
<%@attribute rtexprvalue="false" required="false" name="varStatus" description=" Name of the exported scoped variable for the status of the iteration. Object exported is of type javax.servlet.jsp.jstl.core.LoopTagStatus. This scoped variable has nested visibility.         " %>
<%
            console.log('please implement: "http://java.sun.com/jsp/jstl/xml:forEach"');
            %>