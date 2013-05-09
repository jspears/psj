<%--
        Like <%= ... >, but for expressions.
    --%>
<%@attribute rtexprvalue="true" required="true" name="value" description=" Expression to be evaluated.         " %>
<%@attribute rtexprvalue="true" required="false" name="default" description=" Default value if the resulting value is null.         " %>
<%@attribute rtexprvalue="true" required="false" name="escapeXml" description=" Determines whether characters <,>,&,'," in the resulting string should be converted to their corresponding character entity codes. Default value is true.         " %>
 <%= (value || default)   %>