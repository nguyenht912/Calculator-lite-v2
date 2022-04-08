"use strict";

document.addEventListener(
  "dblclick",
  function (event) {
    event.preventDefault();
  },
  { passive: false }
);

class Calculator {
  constructor() {
    this.createProperties();
    this.getKey();
  }

  createProperties() {
    this.initialSelectors = {
      previousElement: "data-previous",
      currentElement: "data-current",
      keys: "data-key-type",
      numberKey: "number",
      operationKey: "operation",
      clearKey: "clear",
      invertKey: "invert",
      deleteKey: "delete",
      equalKey: "equal",
    };

    this.previousElement = document.querySelector(
      `[${this.initialSelectors.previousElement}]`
    );
    this.currentElement = document.querySelector(
      `[${this.initialSelectors.currentElement}]`
    );
    this.keys = document.querySelectorAll(`[${this.initialSelectors.keys}]`);

    this.keyType;
    this.keyValue;
    this.key;

    this.previousOperand = "";
    this.currentOperand = "0";
    this.operation = undefined;

    this.equalKeyPressed = false;
    this.operationKeyPressed = false;
    this.previousCalculation = 0;
    this.previousOperation;
  }

  getKey() {
    //reset
    //
    this.keys.forEach((key) => {
      key.addEventListener("click", (event) => {
        this.key = key;
        this.keyType = key.dataset.keyType;
        this.keyValue = key.textContent;
        this.keyOperation = key.dataset.operation;
        this.selectMethod(this.keyType, this.keyValue, this.keyOperation);
        console.log(this.keyType + "::::  " + this.keyValue);
      });
    });
  }

  selectMethod(keyType, keyValue, keyOperation) {
    switch (keyType) {
      case "number":
        this.equalKeyPressed = false;
        this.appendNumber(keyValue);
        this.updateDisplay();
        this.latestSecondValue = this.currentOperand;
        break;
      case "operation":
        if (this.equalKeyPressed) {
          this.latestSecondValue = this.currentOperand;
        }
        this.equalKeyPressed = false;
        this.selectOperation(keyOperation);
        this.operationValue = this.keyValue;
        this.updateDisplay();
        this.previousOperation = this.operation;
        // this.latestSecondValue = "";
        break;
      case "clear":
        this.equalKeyPressed = false;
        this.clear();
        this.updateDisplay();
        break;
      case "invert":
        this.equalKeyPressed = false;
        this.invert();
        this.updateDisplay();
        break;
      case "delete":
        this.equalKeyPressed = false;
        this.delete();
        this.updateDisplay();
        break;
      case "decimal":
        this.equalKeyPressed = false;
        this.decimal();
        this.updateDisplay();
        break;
      case "equal":
        if (this.equalKeyPressed) {
          this.calculate(
            this.currentOperand,
            this.previousOperation,
            this.latestSecondValue
          );
        } else {
          this.calculate(
            this.previousOperand,
            this.operation,
            this.currentOperand
          );
        }

        this.updateDisplay();
        this.equalKeyPressed = true;
        break;
    }
  }

  appendNumber(number) {
    console.log("appendNumber method");
    if (this.currentElement.textContent === "0") {
      this.currentOperand = number;
    } else {
      this.currentOperand += number;
    }
  }

  selectOperation(operation) {
    console.log("selectOp method");
    if (this.currentOperand === "") return;
    if (this.previousOperand !== "") {
      this.calculate(this.previousOperand, this.operation, this.currentOperand);
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
  }

  checkExistedOperator() {
    if (this.previousElement.textContent.includes("+", "-", "×", "%", "÷")) {
      return true;
    } else {
      return false;
    }
  }

  clear() {
    console.log("clear method");
    this.currentOperand = "0";
    this.previousOperand = "";
    this.operation = undefined;
    this.operationValue = "";
    this.previousCalculation = 0;
    this.equalKeyPressed = false;
    this.previousOperation = undefined;
    this.latestSecondValue = undefined;
  }

  invert() {
    console.log("invert method");
    if (
      typeof this.currentOperand === undefined ||
      this.currentOperand === null ||
      this.currentOperand === "" ||
      this.currentOperand === 0
    )
      return;
    this.currentOperand = parseFloat(this.currentOperand) * -1;
  }

  delete() {
    console.log("delete method");
    if (this.currentOperand.toString().length == 1) {
      this.currentOperand = 0;
    } else {
      this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }
  }

  decimal() {
    console.log("decimal method");
    if (this.currentElement.textContent.includes(".")) return;
    else if (this.currentOperand === "0") {
      this.currentOperand = "0.";
    } else {
      this.currentOperand += ".";
    }
  }

  calculate(firstValue, operator, secondValue) {
    console.log("calculate method");
    let calculation = 0;

    const firstNum = parseFloat(firstValue);
    const secondNum = parseFloat(secondValue);

    if (
      isNaN(firstNum) ||
      isNaN(secondNum) ||
      this.previousOperation === undefined
    )
      return;

    switch (operator) {
      case "add": {
        calculation = firstNum + secondNum;
        break;
      }
      case "sub": {
        calculation = firstNum - secondNum;
        break;
      }
      case "mul": {
        calculation = firstNum * secondNum;
        break;
      }
      case "div": {
        calculation = firstNum / secondNum;
        break;
      }
      case "mod": {
        calculation = firstNum % secondNum;
        break;
      }
      default:
        break;
    }
    calculation = this.optimizeCalculation(calculation);
    this.currentOperand = calculation;

    this.operation = undefined;
    this.operationValue = "";
    this.previousOperand = "";
  }

  optimizeCalculation(number) {
    if (typeof number === undefined || number === null || isNaN(number)) return;
    number = number.toFixed(6);
    number *= 1;
    return number;
  }

  updateDisplay() {
    console.log("display updated");
    this.currentElement.textContent = this.currentOperand;
    if (this.operation != null) {
      this.previousElement.textContent =
        this.previousOperand + this.operationValue;
    } else {
      this.previousElement.textContent = "";
    }
  }
}

const calculator = new Calculator();
