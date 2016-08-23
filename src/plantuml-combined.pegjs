plantumlfile
  = items:((noise newline { return null }) / (noise "@startuml" noise newline filelines:umllines noise "@enduml" noise { var UMLBlock = require("./uml-block"); return new UMLBlock(filelines) }))* { for (var i = 0; i < items.length; i++) { if (items[i] === null) { items.splice(i, 1); i--; } } return items }
umllines
  = lines:(umlline*) { for (var i = 0; i < lines.length; i++) { if (lines[i]===null) { lines.splice(i, 1); i--; } } return lines; }
umlline
  = propertyset newline { return null }
  / titleset newline { return null }
  / noise newline { return null }
  / commentline { return null }
  / noteline { return null }
  / hideline newline { return null }
  / skinparams newline { return null }
  / declaration:packagedeclaration newline { return declaration }
  / declaration:namespacedeclaration newline { return declaration }
  / declaration:classdeclaration newline { return declaration }
  / declaration:abstractclassdeclaration newline { return declaration }
  / declaration:memberdeclaration newline { return declaration }
  / declaration:connectordeclaration newline { return declaration }
hideline
  = noise "hide empty members" noise
skinparams
  = noise "skinparam" noise [^\r\n]+
connectordeclaration
  = noise leftObject:objectname noise connectordescription? noise connector:connectortype noise connectordescription? noise rightObject:objectname noise ([:] [^\r\n]+)? { var Connection = require("./connection"); return new Connection(leftObject, connector, rightObject) }
connectordescription
  = noise ["]([\\]["]/[^"])*["] noise
titleset
  = noise "title " noise [^\r\n]+ noise
commentline
  = noise "'" [^\r\n]+ noise
  / noise ".." [^\r\n\.]+ ".." noise
  / noise "--" [^\r\n\-]+ "--" noise
  / noise "__" [^\r\n\_]+ "__" noise
noteline
  = noise "note " noise [^\r\n]+ noise
connectortype
  = item:extends { return item }
  / concatenates { var Composition = require("./composition"); return new Composition() }
  / aggregates { var Aggregation = require("./aggregation"); return new Aggregation() }
  / connectorsize { return null }
extends
  = "<|" connectorsize { var Extension = require("./extension"); return new Extension(true) }
  / connectorsize "|>" { var Extension = require("./extension"); return new Extension(false) }
connectorsize
  = ".."
  / "-up-"
  / "-down-"
  / "-left-"
  / "-right-"
  / "---"
  / "--"
  / [.]
  / [-]
concatenates
  = "*" connectorsize
  / connectorsize [*]
aggregates
  = "o" connectorsize
  / connectorsize [o]
startblock
  = noise [{] noise
endblock
  = noise [}]
propertyset
  = "setpropname.*"
packagedeclaration
  = "package " objectname startblock newline umllines endblock
  / "package " objectname newline umllines "end package"
abstractclassdeclaration
  = noise "abstract " noise "class "? noise classname:objectname noise startblock lines:umllines endblock { var AbstractClass = require("./abstract-class"); return new AbstractClass(classname, lines) }
  / noise "abstract " noise "class "? noise classname:objectname noise { var AbstractClass = require("./abstract-class"); return new AbstractClass(classname) }
  / noise "abstract " noise "class "? noise classname:objectname noise newline noise lines:umllines "end class" { var AbstractClass = require("./abstract-class"); return new AbstractClass(classname, lines) }
noise
  = [ \t]*
newline
  = [\r\n]
  / [\n]
classdeclaration
  = noise "class " noise classname:objectname noise startblock lines:umllines endblock { var Class = require("./class"); return new Class(classname, lines) }
  / noise "class " noise classname:objectname noise "<<" noise [^>]+ noise ">>" noise { var Class = require("./class"); return new Class(classname) }
  / noise "class " noise classname:objectname noise { var Class = require("./class"); return new Class(classname) }
  / noise "class " noise classname:objectname noise newline noise lines:umllines "end class" { var Class = require("./class"); return new Class(classname, lines) }
color
  = [#][0-9a-fA-F]+
namespacedeclaration
  = noise "namespace " noise namespacename:objectname noise color? noise startblock lines:umllines endblock { var Namespace = require("./namespace"); return new Namespace(namespacename, lines) }
  / noise "namespace " noise namespacename:objectname noise newline umllines "end namespace" { var Namespace = require("./namespace"); return new Namespace(namespacename) }
staticmemberdeclaration
  = "static " memberdeclaration
memberdeclaration
  = declaration:methoddeclaration { return declaration }
  / declaration:fielddeclaration { return declaration }
fielddeclaration
  = noise accessortype:accessortype noise returntype:returntype noise membername:membername noise { var Field = require("./field"); return new Field(accessortype, returntype, membername) }
  / noise accessortype:accessortype noise membername:membername noise { var Field = require("./field"); return new Field(accessortype, "void", membername) }
  / noise returntype:returntype noise membername:membername noise { var Field = require("./field"); return new Field("+", returntype, membername) }
methoddeclaration
  = noise field:fielddeclaration [(] parameters:methodparameters [)] noise { var Method = require("./method"); return new Method(field.getAccessType(), field.getReturnType(), field.getName(), parameters); }
methodparameters
  = items:methodparameter* { return items; }
methodparameter
  = noise item:returntype membername:([ ] membername)? [,]? { var Parameter = require("./parameter"); return new Parameter(item, membername ? membername[1] : null); }
returntype
  = items:[^ ,\n\r\t(){}]+ { return items.join("") }
objectname
  = objectname:([A-Za-z_][A-Za-z0-9.]*) { return [objectname[0], objectname[1].join("")].join("") }
membername
  = items:([A-Za-z_][A-Za-z0-9_]*) { return [items[0], items[1].join("")].join("") }
accessortype
  = publicaccessor
  / privateaccessor
  / protectedaccessor
publicaccessor
  = [+]
privateaccessor
  = [-]
protectedaccessor
  = [#]
