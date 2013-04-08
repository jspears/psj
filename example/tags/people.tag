<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
    <%@ taglib prefix="p" tagdir="."%>
    <%@ attribute name="people" type="Array"%>
<ul>
   <c:forEach items="${people}" var="person" varStatus="loop">
     <p:person person="${person}"/>
   </c:forEach>
</ul>