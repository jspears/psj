<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="p" tagdir="/WEB-INF/tags"%>
<%@ attribute name="people" type="Array" rtexprvalue="true" %>
<h3>People</h3>
<ul>
   <c:forEach items="${people}" var="person" varStatus="loop">
     <li> <p:person person="${loop.current}"/> </li>
   </c:forEach>
</ul>