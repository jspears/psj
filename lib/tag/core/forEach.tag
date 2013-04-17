<%@ attribute name="items" type="Object" required="false" rtexprvalue="true" %>
<%@ attribute name="begin" type="int" required="false" rtexprvalue="true" %>
<%@ attribute name="end" type="int" required="false" rtexprvalue="true" %>
<%@ attribute name="step" type="int" required="false" rtexprvalue="true" %>
<%@ attribute name="var" type="String" required="false" rtexprvalue="false" %>
<%@ attribute name="varStatus" type="String" required="false" rtexprvalue="false" %>
<%
begin = begin || 0;
end = end || items.length;
for(var i=begin; i < end;i++){
    var status =  scope.pageScope[varStatus]  = {
        first:i == begin,
        last:begin + 1 === end,
        current:items[i]
    }
    console.log('hello', status.current);
%>
<jsp:doBody />
<%
}
%>