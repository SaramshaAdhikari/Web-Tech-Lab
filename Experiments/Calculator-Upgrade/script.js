(function () {
    const app = document.getElementById('app');
    const screen = document.querySelector('.screen');
    const keypad = document.getElementById('keypad');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistory');
    const themeToggleBtn = document.getElementById('themeToggle');
    const memoryStatus = document.getElementById('memoryStatus');
    const errorStatus = document.getElementById('errorStatus');

    let display = document.getElementById('display');
    if (!display) {
        display = document.createElement('div');
        display.id = 'display';
        screen.appendChild(display);
    }

    let expr = '';
    let memoryValue = 0;
    let history = [];

    function setError(message) {
        errorStatus.textContent = message;
    }

    function updateDisplay(value) {
        display.textContent = value || expr || '0';
    }

    function updateMemory() {
        memoryStatus.textContent = 'M: ' + memoryValue;
    }

    function renderHistory() {
        historyList.innerHTML = '';
        if (history.length === 0) {
            const empty = document.createElement('li');
            empty.textContent = 'No calculations yet.';
            historyList.appendChild(empty);
            return;
        }

        history.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            historyList.appendChild(li);
        });
    }

    function safeEval(input) {
        const safeExpr = input
            .replace(/x/g, '*')
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/%/g, '/100');

        if (!/^[0-9+\-*/().\s]+$/.test(safeExpr)) {
            throw new Error('Invalid input');
        }

        const result = Function('"use strict";return (' + safeExpr + ')')();
        if (!Number.isFinite(result)) {
            throw new Error('Math error');
        }

        return result;
    }

    function evaluateCurrent() {
        if (!expr) return;
        try {
            const result = safeEval(expr);
            const formatted = String(Number(result.toFixed(8)));
            history.unshift(expr + ' = ' + formatted);
            if (history.length > 20) history = history.slice(0, 20);
            renderHistory();
            expr = formatted;
            updateDisplay();
            setError('');
        } catch (error) {
            setError(error.message);
            updateDisplay('Error');
            expr = '';
        }
    }

    function toggleSign() {
        if (!expr) return;
        expr = expr[0] === '-' ? expr.slice(1) : '-' + expr;
        updateDisplay();
    }

    function insertParen() {
        const opens = (expr.match(/\(/g) || []).length;
        const closes = (expr.match(/\)/g) || []).length;
        expr += opens > closes ? ')' : '(';
        updateDisplay();
    }

    function addMemory(delta) {
        try {
            const val = expr ? Number(safeEval(expr)) : 0;
            memoryValue += delta * val;
            updateMemory();
            setError('');
        } catch (error) {
            setError(error.message);
        }
    }

    keypad.addEventListener('click', event => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;

        const action = target.getAttribute('data-action');
        const value = target.getAttribute('data-value');

        if (action === 'clear') {
            expr = '';
            updateDisplay();
            setError('');
            return;
        }

        if (action === 'equals') {
            evaluateCurrent();
            return;
        }

        if (action === 'sign') {
            toggleSign();
            return;
        }

        if (action === 'paren') {
            insertParen();
            return;
        }

        if (action === 'mc') {
            memoryValue = 0;
            updateMemory();
            return;
        }

        if (action === 'mr') {
            expr += String(memoryValue);
            updateDisplay();
            return;
        }

        if (action === 'mplus') {
            addMemory(1);
            return;
        }

        if (action === 'mminus') {
            addMemory(-1);
            return;
        }

        if (value) {
            expr += value;
            updateDisplay();
            setError('');
        }
    });

    window.addEventListener('keydown', event => {
        const key = event.key;

        if (/^[0-9]$/.test(key) || ['+', '-', '*', '/', '.', '(', ')', '%'].includes(key)) {
            expr += key;
            updateDisplay();
            setError('');
            return;
        }

        if (key === 'Enter') {
            event.preventDefault();
            evaluateCurrent();
            return;
        }

        if (key === 'Backspace') {
            expr = expr.slice(0, -1);
            updateDisplay();
            return;
        }

        if (key === 'Escape') {
            expr = '';
            updateDisplay();
            setError('');
        }
    });

    clearHistoryBtn.addEventListener('click', () => {
        history = [];
        renderHistory();
    });

    themeToggleBtn.addEventListener('click', () => {
        const current = app.getAttribute('data-theme');
        app.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
    });

    updateDisplay('0');
    updateMemory();
    renderHistory();
})();
