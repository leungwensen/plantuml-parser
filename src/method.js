const Field = require("./field");

class Method extends Field {
  constructor(accessType, returnType, fieldName, aParameters) {
    super();
    this.aParameters = aParameters;
    this.sReturnType = returnType;
  }

  getReturnType() {
    return this.sReturnType;
  }

  needsReturnStatement() {
    return this.sReturnType !== "void";
  }

  getParameters() {
    return this.aParameters;
  }
}

module.exports = Method;

