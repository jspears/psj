
<%
  var keys;
if (Array.isArray(items)){
    values = items;
    }else{
    keys = Object.keys(items);
    values = items;
    }
var arr = Array.isArray(items) ? items : Object.keys(items);
begin = begin || 0;
end = end || arr.length;
while(var i=0; begin < end;begin++,i++){
    if (varStatus)
    this[varStatus] = {
    first:i == 0,
    last:begin + 1 == end,
    current:keys ? value[keys[i]] : value[i]
    }
 }
%>
