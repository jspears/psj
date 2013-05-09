<%--
	The basic iteration tag, accepting many different
        collection types and supporting subsetting and other
        functionality
    --%>
<%@attribute type="java.lang.Object" rtexprvalue="true" required="false" name="items" description=" Collection of items to iterate over.         " %>
<%@attribute type="int" rtexprvalue="true" required="false" name="begin" description=" If items specified: Iteration begins at the item located at the specified index. First item of the collection has index 0. If items not specified: Iteration begins with index set at the value specified.         " %>
<%@attribute type="int" rtexprvalue="true" required="false" name="end" description=" If items specified: Iteration ends at the item located at the specified index (inclusive). If items not specified: Iteration ends when index reaches the value specified.         " %>
<%@attribute type="int" rtexprvalue="true" required="false" name="step" description=" Iteration will only process every step items of the collection, starting with the first one.         " %>
<%@attribute rtexprvalue="false" required="false" name="var" description=" Name of the exported scoped variable for the current item of the iteration. This scoped variable has nested visibility. Its type depends on the object of the underlying collection.         " %>
<%@attribute rtexprvalue="false" required="false" name="varStatus" description=" Name of the exported scoped variable for the status of the iteration. Object exported is of type javax.servlet.jsp.jstl.core.LoopTagStatus. This scoped variable has nested visibility.         " %>
        <%
 var varName = obj.var || obj._var;
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
        obj[varStatus] = obj.pageScope[varStatus] = {
        first: i == begin,
         last: begin + step >= end,
        index:i,
      current: current
    };
     if (varName)
           obj[varName] = obj.pageScope[varName] = current;

try {
%>
    <jsp:doBody/>
        <%
}catch(e){
 console.log('caught error in forEach:doBody', e.message);
}
}
%>