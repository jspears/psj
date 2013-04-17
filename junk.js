var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
    __p+='';
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
    for(var i=0; begin < end;begin++,i++){
        if (varStatus)
            this[varStatus] = {
                first:i == 0,
                last:begin + 1 == end,
                current:keys ? value[keys[i]] : value[i]
            }

        __p+='\n\n    \npageScope.jsp.doBody(evalScope.attrs, "");\n\n\n';
    }

    __p+='\n';
}
return __p;