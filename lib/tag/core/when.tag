<%@attribute name="test" rtexprvalue="true" required="true" %>
<% if(test){
    this.tagContent.parent._test = true;
    console.log('when: ',test);
 %>
   <jsp:doBody/>
<% } %>