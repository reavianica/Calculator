document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('displayValue');

    let currentInput = '0';
    let previousInput = null;
    let operator = null;
    let justCalculated = false;

    function updateDisplay(value) {
        display.textContent = value;
    }

    function appendValue(val) {
        if (currentInput.replace('.', '').length >= 8 && val !== '.') return;

        if (justCalculated && val !== '.') {
            currentInput = val;
            justCalculated = false;
        } else if (currentInput === '0' && val !== '.') {
            currentInput = val;
        } else if (val === '.' && currentInput.includes('.')) {
            return;
        } else {
            currentInput += val;
        }

        updateDisplay(currentInput);
    }

    function clearAll() {
        currentInput = '0';
        previousInput = null;
        operator = null;
        justCalculated = false;
        updateDisplay(currentInput);
    }

    function toggleSign() {
        if (currentInput === '0') return;
        currentInput = currentInput.startsWith('-')
            ? currentInput.slice(1)
            : '-' + currentInput;
        updateDisplay(currentInput);
    }

    function percent() {
        currentInput = (parseFloat(currentInput) / 100).toString();
        if (currentInput.length > 8) {
            currentInput = parseFloat(currentInput).toPrecision(8);
        }
        updateDisplay(currentInput);
    }

    function setOperator(op) {
        if (operator && previousInput !== null && !justCalculated) {
            calculate();
        }
        operator = op;
        previousInput = currentInput;
        currentInput = '0';
        justCalculated = false;
    }

    function calculate() {
        if (!operator || previousInput === null) return;

        const a = parseFloat(previousInput);
        const b = parseFloat(currentInput);

        let result;

        switch (operator) {
            case '+': result = a + b; break;
            case '-': result = a - b; break;
            case '*': result = a * b; break;
            case '/': result = b === 0 ? 'Error' : a / b; break;
        }

        if (result === 'Error') {
            currentInput = 'Error';
        } else {
            const resultStr = result.toString().replace('-', '').replace('.', '');
            if (resultStr.length > 8) {
                currentInput = parseFloat(result).toPrecision(8);
            } else {
                currentInput = result.toString();
            }
        }

        updateDisplay(currentInput);
        previousInput = null;
        operator = null;
        justCalculated = true;
    }

    document.querySelectorAll('[data-val]')
        .forEach(btn => btn.addEventListener('click', () => appendValue(btn.dataset.val)));

    document.querySelectorAll('[data-op]')
        .forEach(btn => btn.addEventListener('click', () => setOperator(btn.dataset.op)));

    document.querySelector('[data-eq]')
        .addEventListener('click', calculate);

    document.querySelectorAll('[data-fn]')
        .forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.dataset.fn === 'clear') clearAll();
                if (btn.dataset.fn === 'toggle-sign') toggleSign();
                if (btn.dataset.fn === 'percent') percent();
            });
        });

    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('light', themeToggle.checked);
    });

});