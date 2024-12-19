class CalculatorUtils {
  constructor() {
    this.termsSymbols = ["+", "-", "×", "^", "÷"];
  }

  splitInTerms(string) {
    const escapedSplitElements = this.termsSymbols.map(element => element.replace(/[.×+\-?^${}()|[\]\\]/g, '\\$&'));
    const splitPattern = new RegExp(`(${escapedSplitElements.join('|')})`, 'g');
    return string.split(splitPattern).filter(element => element !== '');
  }

  stripSpaces(string) {
    return string.split(" ").join("");
  }

  isNegated(string) {
    return string.split("-").length > 1;
  }

  isDecimaled(string) {
    return string.split(".").length > 1;
  }

  isEmpty(string) {
    return string.split("").length === 1 && string === "0";
  }

  fromEvaluation(string) {
    return this.lastCharIsSymbol(string, "=");
  }

  lastCharIsSymbol(string, symbol) {
    return string.split(" ")[string.split(" ").length - 1] === symbol;
  }

  changeLastSymbol(string, symbol) {
    return string.slice(0, string.length - 1) + " " + symbol;
  }

  isMaxLength(string) {
    const maximumLength = 20;
    return this.stripSpaces(string).length === maximumLength;
  }
}


class Operations extends CalculatorUtils{
  addition(numberOne, numberTwo) {
    console.log("ADD")
    return numberOne + numberTwo;
  }

  subtraction(numberOne, numberTwo) {
    console.log("sub")

    return numberOne - numberTwo;
  }

  multiplication(numberOne, numberTwo) {
    console.log("mult")

    return numberOne * numberTwo;
  }

  negate(string) {
    if (this.isNegated(string)) {
      return string.split("-").join("");
    }
    return "-" + string;
  } 

  recip(number) {
    const self = new Operations();
    return self.division(1, number);
  }

  division(nomenator, denomenator) {
    return nomenator / denomenator;
  }

  expbaseten(number) {
    const self = new Operations();
    return self.exponentiation(10, number);
  }

  exponentiation(number, power) {
    return number ** power;
  }

  abs(number) {
    return Math.abs(number);
  }

  sqrt(number) {
    return Math.sqrt(number);
  }

  square(number) {
    return number ** 2;
  }

  fact(number) {
    let result = 1;
    for (let i = 1; i < number + 1; i++) {
      result *= i;
    }
    return result;
  }

  ln(number) {
    return Math.log(number);
  }
  
  log(number) {
    return Math.log10(number);
  }
}


class Calculator extends CalculatorUtils {
  constructor() {
    super();
    this.operations = new Operations();
    this.preprocessing = new Preprocessing();
    this.functionality = new CalculatorUtils();
    this.formating = new Formating();
    this.history = new History();
    this.display = document.getElementById("display");
    this.overview = document.getElementById("overview");
    this.backendOverview = "";
    this.frontendOverview = "";
    this.memo = {expressions: {}, answers: {}};
    this.inPairOperation = false;
    this.inEvaluate = false;
    this.inSingleOperation = false;
  }

  getDisplay() {
    return this.display.innerHTML;
  }

  getDisplayAsInteger() {
    const displayWithNoSpaces = this.stripSpaces(this.getDisplay())
    return parseFloat(displayWithNoSpaces);
  }

  getIndex() {
    return this.memo["expressions"].length;
  }

  backspace() {
    const display = this.getDisplay();
    if (!this.isEmpty(display)) {
      const updatedDisplay = display.slice(0, display.length - 1);
      this.display.innerHTML = this.formating.formatNumber(updatedDisplay, this.inEvaluate);
    } 
  }

  clear() {
      this.display.innerHTML = '0';
      this.overview.innerHTML = '';
      this.frontendOverview = "";
      this.backendOverview = "";
  }

  showSymbolOnDisplay(symbol) {
    const display = this.getDisplay();
    let updatedDisplay = display + symbol;
    if (this.fromEvaluation(display)) {
      return;
    } else if (this.isMaxLength(display) || symbol === "." && this.isDecimaled(display)) {
      updatedDisplay = display;
    } else if ( this.isEmpty(display)) {
      updatedDisplay = symbol;
    } 
    this.display.innerHTML = this.formating.formatNumber(updatedDisplay, this.inEvaluate);
  }

  showExponentiation() {
    this.updateOverviewPairOperation("^");
  }
  
  showMultiplication() {
    this.updateOverviewPairOperation("×");
  }

  showDivision() {
    this.updateOverviewPairOperation("÷");
  }

  showAddition() {
    this.updateOverviewPairOperation("+");
  }

  showSubtraction() {
    this.updateOverviewPairOperation("-");
  }

  updateOverviewPairOperation(operationSymbol) {
    const display = this.getDisplay();

    if (this.frontendOverview === "" || this.fromEvaluation(this.frontendOverview)) {
      this.backendOverview = display + operationSymbol;
      this.frontendOverview = display + operationSymbol;
    } else if (this.inPairOperation && display == "0") {
      this.backendOverview = this.changeLastSymbol(this.backendOverview, operationSymbol);
      this.frontendOverview = this.changeLastSymbol(this.frontendOverview, operationSymbol);
    } else if (this.inSingleOperation) {
      this.backendOverview = this.backendOverview + operationSymbol;
      this.frontendOverview = this.frontendOverview + operationSymbol;
    } else {
      this.backendOverview = this.backendOverview + display + operationSymbol;
      this.frontendOverview = this.frontendOverview + display + operationSymbol;
    }
    this.display.innerHTML = "0";
    this.overview.innerHTML = this.formating.addSpace(this.frontendOverview);
    this.inSingleOperation = false;
    this.inPairOperation = true;
  }

  updateOverviewSingleOperation(operationFunction) {
    const display = this.getDisplayAsInteger();
    const answer = operationFunction(display);
    this.frontendOverview = this.frontendOverview + operationFunction.name + "(" + display + ")",
    this.backendOverview  = this.backendOverview + answer;
    this.overview.innerHTML = this.formating.addSpace(this.frontendOverview);
    this.display.innerHTML = this.formating.formatNumber(String(answer), this.inEvaluate);
    this.inSingleOperation = true;
    this.inPairOperation = false;
  }

  singleSquare() {
    this.updateOverviewSingleOperation(this.operations.square);
  }

  singleSquareRoot() {
    this.updateOverviewSingleOperation(this.operations.sqrt);
  }

  singleAbsolute() {
    this.updateOverviewSingleOperation(this.operations.abs);
  }

  singleReciprocal() {
    this.updateOverviewSingleOperation(this.operations.recip);
  }

  singleFactorial() {
    this.updateOverviewSingleOperation(this.operations.fact);
  }

  singleExpbaseten() {
    this.updateOverviewSingleOperation(this.operations.expbaseten);
  }

  singleLog() {
    this.updateOverviewSingleOperation(this.operations.log);
  }

  singleLn() {
    this.updateOverviewSingleOperation(this.operations.ln);
  }

  evaluate() {
    const index = this.getIndex();
    const display = this.getDisplay()

    if (!this.lastCharIsSymbol(this.frontendOverview, "=")) {
      this.inEvaluate = true;
      
      if (this.inSingleOperation) {
        this.overview.innerHTML = this.formating.addSpace(this.frontendOverview + "=");
      } else if (this.inPairOperation && this.isNegated(display) === false) {
        this.overview.innerHTML = this.formating.addSpace(this.frontendOverview + display + "=");
        this.backendOverview = this.backendOverview + display;
      } else {
        this.overview.innerHTML = this.formating.addSpace(this.frontendOverview + this.getDisplay() + "=");
      }
      this.memo["expressions"]["calculation_" + index] = this.formating.addSpace(this.backendOverview);
    
      const answer = this.calculate();
      const formatedAnswer = this.formating.formatNumber(answer, this.inEvaluate);
      this.display.innerHTML = formatedAnswer;
      this.memo["answers"]["calculation_" + index] = formatedAnswer;
  
      this.history.updateHistory(this.memo, index);
      this.frontendOverview = "";
      this.backendOverview = "";
      this.inEvaluate = false;
    }
  }

  calculate() {
    const rawExpression = this.memo["expressions"]["calculation_" + this.currentIndex];
    var expression = this.preprocessing.preprocessExpression(rawExpression);

    class CalculateHelper  {
      constructor(expression, self) {
        this.self = self
        this.i = 0
        this.expression = expression
      }

      getAnswer() {
        this.computeExpression()
        return String(this.expression)
      }

      updateElementsBasedOnNewIndex() {
        this.current = this.expression[this.i];
        this.successor = parseFloat(this.expression[this.i + 1]);
        this.predecessor = parseFloat(this.expression[this.i - 1]);
      }

      updateExpressionWithResult(result) {
        this.expression[this.i] = result; 
        this.expression[this.i - 1] = " "; 
        this.expression[this.i + 1] = " "; 
      }

      pairComputation(operationFunction) {
        var result = operationFunction(this.predecessor, this.successor);
        this.updateExpressionWithResult(result);
        this.i = 0;
        this.computeExpression();
      }

      computeExpression() {
        this.expression = this.expression.filter(element => element !== " ");
        if (this.expression.length === 1) {
          return String(this.expression);
        }
        this.updateElementsBasedOnNewIndex();
        const exponentiation = this.expression.includes("^");
        const multiplication = this.expression.includes("×")|| this.expression.includes("÷");

        // Computing exponentiation first
        if (this.expression.includes("^") && this.current === "^") {
          this.pairComputation(this.self.operations.exponentiation)

        // Computing multiplication and division calculations secondly
        } else if (this.expression.includes("×") && this.current === "×" && !(exponentiation)) {
          this.pairComputation(this.self.operations.multiplication)
        } else if (this.expression.includes("÷") && this.current === "÷" && !(exponentiation)) {
          this.pairComputation(this.self.operations.division)

          // Computing addition and subtraction calculations lastly
        } else if (this.expression.includes("+") && this.current === "+" && !(multiplication)) {
          this.pairComputation(this.self.operations.addition)
        } else if (this.expression.includes("-") && this.current === "-" && !(multiplication)) {
          this.pairComputation(this.self.operations.subtraction)
          
        } else {
          this.i += 1;
          this.computeExpression();
        }
      }
    }
    const helper = new CalculateHelper(expression, this)
    return helper.getAnswer();
  }
  

  plusOrMinus() {
    const display = this.getDisplay();
    if (this.isEmpty(display)) return;
    
    if (this.frontendOverview === '') {
      this.display.innerHTML = this.operations.negate(display);
    }

    else {
      this.display.innerHTML = this.operations.negate(display);

      if (!(this.backendOverview === "")) {
        const split = this.splitInTerms(this.backendOverview + display)
        this.backendOverview = split.slice(0, -1).join("") + this.operations.negate(split[split.length - 1 ])
      } 
  
      if (this.inSingleOperation) {
        const split = this.splitInTerms(this.frontendOverview);
        this.frontendOverview =  split.slice(0, -1).join("") + "negate(" + split[split.length - 1 ] + ")";
  
        this.overview.innerHTML = this.formating.addSpace(this.frontendOverview);
      }
    }
  }  
}

class Formating extends CalculatorUtils  {
  constructor() {
    super();
  }

  formatNumber(number, evaluate) {
    if (this.isDecimaled(number) && evaluate === false) {
      var formattedNumber = number;
    } else if (this.isDecimaled(number) && evaluate === true) {
      var formattedNumber = this.formatDecimalNumber(number);
    } else {
      var formattedNumber = this.formatWholeNumber(number);
    }
    return formattedNumber;
  }

  formatDecimalNumber(decimalNumber) {
    const splitNumber = decimalNumber.split(".");
    const decimals = splitNumber[1];
    const wholeNumber = splitNumber[0];
    return this.formatWholeNumber(wholeNumber) + "." + decimals;
  }

  formatWholeNumber(wholeNumber) {
    const wholeNumberStripSpaces = this.stripSpaces(wholeNumber);
    let formattedWholeNumber = '';

    for (let i = 0; i < wholeNumberStripSpaces.length; i++) {
      if (i > 0 && (wholeNumberStripSpaces.length - i) % 3 === 0) {
        formattedWholeNumber += ' ';
      }
      formattedWholeNumber += wholeNumberStripSpaces[i];
    }
    return formattedWholeNumber;
  }

  addSpace(string) {
    let returnString = "";
    for (let element of this.splitInTerms(string)) {
      if (this.termsSymbols.includes(element)) {
        returnString += " " + element + " ";
      } else {
        returnString += element;
      }
    }
    return returnString;
  }
}


class Preprocessing extends CalculatorUtils {
  preprocessExpression(inputString) {
    let expression = this.decodeExpression(inputString);
    expression = this.handlePrefix(expression);
    expression = this.concatDoubleAdditives(expression);
    return this.handlePrefixingMinuses(expression);
  }

  decodeExpression(inputString) {
    const spacesRemoved = this.stripSpaces(inputString);
    const escapedSplitElements = this.termsSymbols.map(element => element.replace(/[.×+\-?^${}()|[\]\\]/g, '\\$&'));
    const splitPattern = new RegExp(`(${escapedSplitElements.join('|')})`, 'g');
    return spacesRemoved.split(splitPattern).filter(element => element !== '');
  }

  handlePrefix(expressionArray) {
    if (expressionArray[0] === "-") {
      expressionArray[1] = "-" + expressionArray[1];
      expressionArray.splice(0, 1);
    }
    return expressionArray;
  }

  concatDoubleAdditives(expressionArray) {
    const updatedArray = [...expressionArray];

    for (let i = 0; i < expressionArray.length; i++) {
      const current = updatedArray[i];
      const successor = updatedArray[i + 1];

      if (current === "-" && successor === "-") {
        updatedArray[i] = "+";
        updatedArray.splice(i + 1, 1);
      } else if (current === "+" && successor === "-") {
        updatedArray[i + 1] = "-";
        updatedArray.splice(i, 1);
      }
    }
    return updatedArray;
  }

  handlePrefixingMinuses(expressionArray) {
    const updatedArray = [...expressionArray];

    for (let i = 0; i < expressionArray.length; i++) {
      const current = updatedArray[i];
      const predecessor = updatedArray[i - 1];
      const successor = updatedArray[i + 1];
      if (current === "-" && ["×", "^", "÷"].includes(predecessor)) {
        updatedArray[i] = "-" + successor;
        updatedArray.splice(i + 1, 1);
      } 
    }
    return updatedArray;
  }
}


class History {
  constructor () {
    this.display = document.getElementById("display");
    this.overview = document.getElementById("overview");
    this.historyDeleteButton = document.getElementById("delete-history");
    this.historyDeleteButton.addEventListener("click", this.clearHistory);
  }

  updateHistory(history, index) {
    const currentCalculationIndex = ["calculation_" + index];
    const container = this.createHistoryCalculationContainer();
    const expression = history["expressions"][currentCalculationIndex];
    const answer = history["answers"][currentCalculationIndex];

    const expressionElement = this.createHistoryElementWithContent(expression);
    expressionElement.classList = "expression";

    const answerElement = this.createHistoryElementWithContent(answer);
    answerElement.classList = "answer";

    container.appendChild(expressionElement);
    container.appendChild(answerElement);
    document.getElementById("history").appendChild(container);

    setTimeout(() => {
      container.style.opacity = "1";
      container.style.transform = "translate(0rem)";
    }, 300);
  }

  createHistoryCalculationContainer() {
    const element = document.createElement("div");
    element.style.cssText = "opacity: 0; transform: translate(-5rem);";
    element.classList = "calculation";
    
    element.addEventListener("click", () => {
      if (element.children.length === 2) {
        const expression = element.children[0].innerHTML;
        const answer = element.children[1].innerHTML;
        this.overview.innerHTML = expression;
        this.display.innerHTML = answer;
    }})
    return element;
  }

  createHistoryElementWithContent(content) {
    const element = document.createElement("div");
    element.innerHTML = content;
    return element;
  }

  clearHistory() {
    const historyDiv = document.getElementById("history");
    while (historyDiv.firstChild) {
      historyDiv.removeChild(historyDiv.firstChild);
    }
  }
}


export default Calculator;
