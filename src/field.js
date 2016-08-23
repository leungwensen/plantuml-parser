class Field {
  constructor(accessType, returnType, fieldName) {
    this.sAccessType = accessType;
    this.sReturnType = returnType;
    this.sFieldName = fieldName;
  }

  getAccessType() {
    return this.sAccessType;
  }

  getReturnType() {
    return this.sReturnType;
  }

  getName() {
    return this.sFieldName;
  }
}

module.exports = Field;
