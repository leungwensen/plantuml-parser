const Class = require("./class");

class AbstractClass extends Class {
  constructor(className, fileLines) {
    super();
  }

  isAbstract() {
    return true;
  }
}

module.exports = AbstractClass;
