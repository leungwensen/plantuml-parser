const Namespace = require("./namespace");
const Class = require("./class");
const AbstractClass = require("./abstract-class");
const Connection = require("./connection");
const Package = require("./package");
const Extension = require("./extension");

class UMLBlock {
  constructor(fileLines) {
    this.aNamespaces = []; // contains all defined namespaces
    this.aPackages = []; // contains all defined packages
    this.aClasses = []; // contains all defined classes
    this.aConnections = []; // contains all defined connections
    this.aItems = fileLines;
    this.populateGlobals(this);
    this.setupConnections();
  }

  getClasses() {
    return this.aClasses;
  }

  getItems() {
    return this.aItems;
  }

  setupConnections() {
    for (let i = 0, length = this.aConnections.length; i < length; i++) {
      this.setupConnection(this.aConnections[i]);
    }
  }

  setupConnection(connection) {
    let cLeft = null;
    let cRight = null;
    for (let i = 0, length = this.aClasses.length; i < length; i++) {

      if (connection.leftObject.includes(".")) {
        if (connection.leftObject.indexOf(".") === 0) {
          if (this.aClasses[i].getNamespace() === null && this.aClasses[i].getName() === connection.leftObject.substring(1)) {
            cLeft = this.aClasses[i];
          }
        } else {
          if (this.aClasses[i].getFullName() === connection.leftObject) {
            cLeft = this.aClasses[i];
          }
        }
      } else if (this.aClasses[i].getName() === connection.leftObject && this.aClasses[i].getNamespace() === connection.getNamespace()) {
        cLeft = this.aClasses[i];
      }

      if (connection.rightObject.includes(".")) {
        if (connection.rightObject.indexOf(".") === 0) {
          if (this.aClasses[i].getNamespace() === null && this.aClasses[i].getName() === connection.rightObject.substring(1)) {
            cRight = this.aClasses[i];
          }
        } else {
          if (this.aClasses[i].getFullName() === connection.rightObject) {
            cRight = this.aClasses[i];
          }
        }
      } else if (this.aClasses[i].getName() === connection.rightObject && this.aClasses[i].getNamespace() === connection.getNamespace()) {
        cRight = this.aClasses[i];
      }

    }

    if (cLeft !== null && cRight !== null) {
      if (connection.getConnector() instanceof Extension) {
        if (connection.getConnector().isLeft()) {
          cRight.setExtends(cLeft);
        } else {
          cLeft.setExtends(cRight);
        }
      }
    }
  }

  populateGlobals(item) {

    const items = item.getItems();

    for (let i = 0, length = items.length; i < length; i++) {
      if (items[i] instanceof Namespace) {
        this.aNamespaces.push(items[i]);
        this.populateGlobals(items[i]);
      } else if (items[i] instanceof Class || items[i] instanceof AbstractClass) {
        this.aClasses.push(items[i]);
      } else if (items[i] instanceof Package) {
        this.aPackages.push(items[i]);
        this.populateGlobals(items[i]);
      } else if (items[i] instanceof Connection) {
        this.aConnections.push(items[i]);
      } else {
        throw "Unknown type";
      }
    }
  }
}

module.exports = UMLBlock;
