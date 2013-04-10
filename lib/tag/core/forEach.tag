<%@ attribute name="items" type="Object" required="false" rtexprvalue="true" %>
<%@ attribute name="begin" type="int" required="false" rtexprvalue="true" %>
<%@ attribute name="end" type="int" required="false" rtexprvalue="true" %>
<%@ attribute name="step" type="int" required="false" rtexprvalue="true" %>
<%@ attribute name="var" type="String" required="false" rtexprvalue="false" %>
<%@ attribute name="varStatus" type="String" required="false" rtexprvalue="false" %>
<%
var keys;
if (Array.isArray(items){
  values = items;
}else{
  keys = Object.keys(items);
  values = items;
}
var arr = Array.isArray(items) ? items : Object.keys(items);
varStatus = varStatus ||
begin = begin || 0;
end = end || arr.length;
while(var i=0; begin < end;begin++,i++){
    this[varStatus] = {
        first:i == 0,
        last:begin + 1 == end,
        current:keys ? value[keys[i]] : value[i]
    }
%>
    <jsp:doBody/>
<%}%>


%>