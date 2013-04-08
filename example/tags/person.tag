<%@taglib prefix="fn" tagdir="/functions" %>
<%@attribute name="person" type="Object" %>
<h3>${fn:title(person.fullName)}</h3>
<div>
    ${person.description}
</div>
