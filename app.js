import Calculator from "./calculator.js";
const calculator = new Calculator();
const π = '3.14159265358';
const e = '2.71828';

const buttons = [
  { symbol: 'x^2', image: 'square.png', onClick: calculator.singleSquare.bind(calculator) },
  { symbol: '1/x', image: 'reciprocal.png', onClick: calculator.singleReciprocal.bind(calculator) },
  { symbol: 'abs', image: 'abs.png', onClick: calculator.singleAbsolute.bind(calculator) },
  { symbol: 'CE', image: 'clear.png', onClick: calculator.clear.bind(calculator) },
  { symbol: 'back', image: 'back.png', onClick: calculator.backspace.bind(calculator) },
  { symbol: 'sqrt', image: 'squareroot.png', onClick: calculator.singleSquareRoot.bind(calculator) },
  { symbol: e, image: 'e.png', onClick: calculator.showSymbolOnDisplay.bind(calculator) },
  { symbol: π, image: 'pi.png', onClick: calculator.showSymbolOnDisplay.bind(calculator) },
  { symbol: 'n!', image: 'factorial.png', onClick: calculator.singleFactorial.bind(calculator) },
  { symbol: '÷', image: 'divide.png', onClick: calculator.showDivision.bind(calculator) },
  { symbol: 'exp',image: 'exponentiation.png', onClick: calculator.showExponentiation.bind(calculator) },
  { symbol: '7', image: '7.png', onClick: calculator.showSymbolOnDisplay.bind(calculator) },
  { symbol: '8', image: '8.png', onClick: calculator.showSymbolOnDisplay.bind(calculator) },
  { symbol: '9', image: '9.png', onClick: calculator.showSymbolOnDisplay.bind(calculator) },
  { symbol: '×', image: 'multiply.png', onClick: calculator.showMultiplication.bind(calculator) },
  { symbol: '10^x', image: 'expbaseten.png', onClick: calculator.singleExpbaseten.bind(calculator) },
  { symbol: '4', image: '4.png', onClick: calculator.showSymbolOnDisplay.bind(calculator) },
  { symbol: '5', image: '5.png', onClick: calculator.showSymbolOnDisplay.bind(calculator) },
  { symbol: '6', image: '6.png', onClick: calculator.showSymbolOnDisplay.bind(calculator) },
  { symbol: '-', image: 'minus.png', onClick: calculator.showSubtraction.bind(calculator) },
  { symbol: 'log', image: 'log.png', onClick: calculator.singleLog.bind(calculator) },
  { symbol: '1', image: '1.png', onClick: calculator.showSymbolOnDisplay.bind(calculator) },
  { symbol: '2', image: '2.png', onClick: calculator.showSymbolOnDisplay.bind(calculator) },
  { symbol: '3', image: '3.png', onClick: calculator.showSymbolOnDisplay.bind(calculator) },
  { symbol: '+', image: 'plus.png', onClick: calculator.showAddition.bind(calculator) },
  { symbol: 'ln', image: 'ln.png', onClick: calculator.singleLn.bind(calculator) },
  { symbol: '+/-', image: 'plusminus.png', onClick: calculator.plusOrMinus.bind(calculator) },
  { symbol: '0', image: '0.png', onClick: calculator.showSymbolOnDisplay.bind(calculator) },
  { symbol: '.', image: 'point.png', onClick: calculator.showSymbolOnDisplay.bind(calculator) },
  { symbol: '=', image: 'equal.png', onClick: calculator.evaluate.bind(calculator) },
];

const lightGreyButtons = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "+/-", "0", "."];
const greyButtons = ["="];

function createButton(symbol, image, onClick) {
  const button = document.createElement('button');

  if (lightGreyButtons.includes(symbol)) {
    button.className = 'input-button light-grey';
  } else if (greyButtons.includes(symbol)) {
    button.className = 'input-button grey';
  } else {
    button.className = 'input-button dark-grey';
  };

  const img = document.createElement('img');
  img.src = `./assets/${image}`;
  img.alt = symbol;
  img.className = 'input-button-img';
  button.appendChild(img);
  button.addEventListener('click', () => onClick(symbol));
  return button;
};

window.addEventListener('DOMContentLoaded', () => {
  const buttonsContainer = document.querySelector('.input-buttons');

  const numRows = 6;
  const numColumns = 5;

  for (let row = 0; row < numRows; row++) {
    const rowContainer = document.createElement('div');
    rowContainer.className = 'input-buttons-row';

    for (let col = 0; col < numColumns; col++) {
      const buttonIndex = row * numColumns + col;
      if (buttonIndex < buttons.length) {
        const { symbol, image, onClick } = buttons[buttonIndex];
        const button = createButton(symbol, image, onClick);
        rowContainer.appendChild(button);
      };
    };

    buttonsContainer.appendChild(rowContainer);
  };
});

window.addEventListener('resize', () => {
  const width = window.innerWidth;
  if (width < 800) {
    document.getElementById("history-area").style.opacity = "0";
    document.getElementById("history-area").style.width = "0%";
    document.getElementById("calculator").style.width = "100%";
  } else {
    document.getElementById("history-area").style.opacity = "1";
    document.getElementById("history-area").style.width = "20%";
    document.getElementById("calculator").style.width = "80%";
  }
});
