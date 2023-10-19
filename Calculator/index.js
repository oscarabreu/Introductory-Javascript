let buffer = '0';
let runningTotal = 0; 
let previousOperator;
const screen = document.querySelector('.value');


function init() {
    document.querySelector('.calculator')
    document.addEventListener("click", function(event) {
        buttonClick(event.target.innerText);
    });
}

function rerender () {
screen.innerText = buffer;
}

function buttonClick(value) {
    if (isNaN(parseInt(value))) {
        handleSymbol(value);
    }
    else if ((parseInt(value) >= 0 && parseInt(value) <= 9) && (value.length<=2)) {
        handleNumber(value);
    }
    rerender();
}

function handleNumber(value) {
    if (buffer === '0') {
        buffer = value;
    }
    else {
        buffer = buffer + value;
    }
}

function handleSymbol(value) {
    switch (value) {
        case 'C':
            buffer = '0';
            break;
        case '←':
            if (buffer.length === 1) {
                buffer = '0';
            }
            else {
                buffer = buffer.substring(0, buffer.length-1);
            }
            break;
        case '÷':
        case '×':
        case '-':
        case '+':
            handleMath(value);
            break;
        case '=':
            if (runningTotal === null) {
                return;
            }
            else {
                flushOperation(parseInt(buffer));
                previousOperator = null;
                buffer = "" + runningTotal;
                runningTotal = 0;
                break;
            }
    }
}

function handleMath(value) {
    if (buffer === '0') {
        return;
    }
    const intBuffer = parseInt(buffer);
    if (runningTotal === 0) {
        runningTotal = intBuffer;
    }
    else {
        flushOperation(intBuffer);
    }

    previousOperator = value;
    buffer = '0';
}

function flushOperation(intBuffer) {
    if (previousOperator === '+') {
        runningTotal += intBuffer;
    }
    else if (previousOperator === '-' ) {
        runningTotal -= intBuffer;
    }
    else if (previousOperator === '×' ) {
        runningTotal *= intBuffer;
    }
    else if (previousOperator === '÷' ) {
        runningTotal /= intBuffer;
    }
}

init();