<%@taglib prefix="fn" tagdir="/functions" %>
<%@attribute name="person" type="Object" rtexprvalue="true" %>
<div>
    <h3>${person.name}</h3>
    ${person.description}
    <jsp:doBody/>
</div>
