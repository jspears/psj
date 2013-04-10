var Context = require('./psj-context');
var Tag = function(parent){
    this.parent = parent;
    this.context = new Context();
}
Tag.prototype.create = function(attrs, content){
    if (content)
        this.context.parse(content);


}