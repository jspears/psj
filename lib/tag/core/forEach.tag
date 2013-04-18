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
    if (varStatus)
    pageScope[varStatus] = {
        first: i == begin,
         last: begin + step >= end,
      current: current
    };

 if (varName)
  pageScope[varName] = current;

%>
<jsp:doBody/>
<%
}

%>