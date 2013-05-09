<%--
	Subtag of <choose> that includes its body if its
	condition evalutes to 'true'
    --%>
<%@attribute type="boolean" rtexprvalue="true" required="true" name="test" description=" The test condition that determines whether or not the body content should be processed.         " %>
<% if(test){
    this.tagContent.parent._test = true;
%>
    <jsp:doBody/>
<% } %>