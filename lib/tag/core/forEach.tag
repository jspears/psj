<%@ attribute name="items" type="Object" required="false" rtexprvalue="true" %>
<%@ attribute name="begin" type="int" required="false" rtexprvalue="true" %>
<%@ attribute name="end" type="int" required="false" rtexprvalue="true" %>
<%@ attribute name="step" type="int" required="false" rtexprvalue="true" %>
<%@ attribute name="var" type="String" required="false" rtexprvalue="false" %>
<%@ attribute name="varStatus" type="String" required="false" rtexprvalue="false" %>
<%
 var varName = obj.var;
 if (!(typeof items === "string" || Array.isArray(items))) {
                    var keys = Object.keys(items);
                    var nitems = keys.map(function (v) {
                        return {key: v, value: items[v]}
                    });
                    items = nitems;
 }

  begin = begin || 0;
  end = end || items.length;
  step = step || 1;
  for (var i = begin; i < end; i += step) {
     var current = items[i];
    console.log('forEach.tag', current);
    if (varStatus)
    obj.pageScope[varStatus] = {
        first: i == begin,
         last: begin + step >= end,
        index:i,
      current: current
    };
     if (varName)
  obj.pageScope[varName] = current;

try {
%>
<jsp:doBody/>
<%
}catch(e){
 console.log('caught error in forEach:doBody', e.message);
}
}
%>