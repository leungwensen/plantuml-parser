const Field = require("./field");
const Method = require("./method");

class Class {
  constructor(className, fileLines) {
    this.cExtends = null;
    this.fileLines = fileLines || [];
    this.className = className;
    this.nNamespace = null;
  }

  setExtends(className) {
    this.cExtends = className;
  }

  getExtends() {
    return this.cExtends;
  }

  setNamespace(namespace) {
    this.nNamespace = namespace;
  }

  getNamespace() {
    return this.nNamespace;
  }

  getName() {
    return this.className;
  }

  hasMethods() {
    for (let i = 0, length = this.fileLines.length; i < length; i++) {
      if (this.fileLines[i] instanceof Method) {
        return true;
      }
    }
    return false;
  }

  getMethods() {
    const aResult = [];
    for (let i = 0, length = this.fileLines.length; i < length; i++) {
      if (this.fileLines[i] instanceof Method) {
        aResult.push(this.fileLines[i]);
      }
    }
    return aResult;
  }

  hasFields() {
    for (let i = 0, length = this.fileLines.length; i < length; i++) {
      if (!(this.fileLines[i] instanceof Method) && this.fileLines[i] instanceof Field) {
        return true;
      }
    }
    return false;
  }

  getFields() {
    const aResult = [];
    for (let i = 0, length = this.fileLines.length; i < length; i++) {
      if (!(this.fileLines[i] instanceof Method) && this.fileLines[i] instanceof Field) {
        aResult.push(this.fileLines[i]);
      }
    }
    return aResult;
  }

  getFullName() {
    if (this.getNamespace() !== null) {
      return `${this.getNamespace().getFullName()}.${this.getName()}`;
    } else {
      return this.getName();
    }
  }

  isAbstract() {
    return false;
  }
}

module.exports = Class;
