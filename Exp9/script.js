(function () {
    const root = document.documentElement;
    const app = document.getElementById('app');
    const keypad = document.getElementById('keypad');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistory');
    const themeToggleBtn = document.getElementById('themeToggle');
    const angleToggleBtn = document.getElementById('angleToggle');
    const memoryStatus = document.getElementById('memoryStatus');
    const errorStatus = document.getElementById('errorStatus');
    const expressionLine = document.getElementById('expressionLine');
    const modeTabs = Array.from(document.querySelectorAll('.mode-tab[data-mode]'));
    const modePanels = Array.from(document.querySelectorAll('.mode-panel'));
    const display = document.getElementById('display');
    const THEME_STORAGE_KEY = 'calculator-upgrade-theme';
    const HISTORY_STORAGE_KEY = 'calculator-upgrade-history';

    let expr = '';
    let memoryValue = 0;
    let history = [];
    let angleMode = 'deg';

    function readLocalHistory() {
        try {
            const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
            if (!stored) return [];
            const parsed = JSON.parse(stored);
            if (!Array.isArray(parsed)) return [];
            return parsed.map(item => String(item)).filter(Boolean).slice(0, 20);
        } catch (_error) {
            return [];
        }
    }

    function writeLocalHistory() {
        try {
            localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history.slice(0, 20)));
        } catch (_error) {
            // Ignore storage failures so calculator actions continue.
        }
    }

    function setTheme(theme) {
        const resolved = theme === 'light' ? 'light' : 'dark';
        root.setAttribute('data-theme', resolved);
        try {
            localStorage.setItem(THEME_STORAGE_KEY, resolved);
        } catch (_error) {
            // Ignore storage errors.
        }
    }

    function initTheme() {
        let storedTheme = null;
        try {
            storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        } catch (_error) {
            storedTheme = null;
        }

        const initialTheme = storedTheme || root.getAttribute('data-theme') || 'dark';
        setTheme(initialTheme);
    }

    const OP_INFO = {
        '+': { precedence: 2, associativity: 'left', args: 2 },
        '-': { precedence: 2, associativity: 'left', args: 2 },
        '*': { precedence: 3, associativity: 'left', args: 2 },
        '/': { precedence: 3, associativity: 'left', args: 2 },
        '^': { precedence: 4, associativity: 'right', args: 2 },
        nCr: { precedence: 3, associativity: 'left', args: 2 },
        nPr: { precedence: 3, associativity: 'left', args: 2 },
        '!': { precedence: 5, associativity: 'left', args: 1 },
        '%': { precedence: 5, associativity: 'left', args: 1 },
        neg: { precedence: 4, associativity: 'right', args: 1 }
    };

    function degToRad(value) {
        return value * Math.PI / 180;
    }

    function radToDeg(value) {
        return value * 180 / Math.PI;
    }

    function parseIntegerOperand(value, label) {
        if (!Number.isFinite(value) || value < 0 || Math.floor(value) !== value) {
            throw new Error(label + ' expects non-negative integers');
        }
        return value;
    }

    function factorial(value) {
        const n = parseIntegerOperand(value, 'Factorial');
        if (n > 170) {
            throw new Error('Number too large for factorial');
        }
        let result = 1;
        for (let i = 2; i <= n; i += 1) {
            result *= i;
        }
        return result;
    }

    function nPr(n, r) {
        const nValue = parseIntegerOperand(n, 'nPr');
        const rValue = parseIntegerOperand(r, 'nPr');
        if (rValue > nValue) {
            throw new Error('For nPr, r cannot be greater than n');
        }
        return factorial(nValue) / factorial(nValue - rValue);
    }

    function nCr(n, r) {
        const nValue = parseIntegerOperand(n, 'nCr');
        const rValue = parseIntegerOperand(r, 'nCr');
        if (rValue > nValue) {
            throw new Error('For nCr, r cannot be greater than n');
        }
        return factorial(nValue) / (factorial(rValue) * factorial(nValue - rValue));
    }

    function funcCall(name, arg) {
        const fn = name.toLowerCase();
        if (fn === 'sin') return Math.sin(angleMode === 'deg' ? degToRad(arg) : arg);
        if (fn === 'cos') return Math.cos(angleMode === 'deg' ? degToRad(arg) : arg);
        if (fn === 'tan') return Math.tan(angleMode === 'deg' ? degToRad(arg) : arg);
        if (fn === 'asin') return angleMode === 'deg' ? radToDeg(Math.asin(arg)) : Math.asin(arg);
        if (fn === 'acos') return angleMode === 'deg' ? radToDeg(Math.acos(arg)) : Math.acos(arg);
        if (fn === 'atan') return angleMode === 'deg' ? radToDeg(Math.atan(arg)) : Math.atan(arg);
        if (fn === 'log') {
            if (arg <= 0) throw new Error('log domain error');
            return Math.log10(arg);
        }
        if (fn === 'ln') {
            if (arg <= 0) throw new Error('ln domain error');
            return Math.log(arg);
        }
        if (fn === 'sqrt') {
            if (arg < 0) throw new Error('sqrt domain error');
            return Math.sqrt(arg);
        }
        if (fn === 'exp') return Math.exp(arg);
        if (fn === 'abs') return Math.abs(arg);
        if (fn === 'round') return Math.round(arg);
        throw new Error('Unknown function: ' + name);
    }

    function isAlphaChar(char) {
        return /^[a-zA-Z]$/.test(char);
    }

    function tokenize(input) {
        const src = (input || '').replace(/\s+/g, '');
        const tokens = [];
        let i = 0;

        while (i < src.length) {
            const char = src[i];

            if (/[0-9.]/.test(char)) {
                let numberText = char;
                i += 1;
                while (i < src.length && /[0-9.]/.test(src[i])) {
                    numberText += src[i];
                    i += 1;
                }
                if (!/^\d*\.?\d+$/.test(numberText)) {
                    throw new Error('Invalid number format');
                }
                tokens.push({ type: 'number', value: Number(numberText) });
                continue;
            }

            if (char === '(' || char === ')' || char === '+' || char === '*' || char === '/' || char === '^' || char === '!' || char === '%') {
                tokens.push({ type: 'symbol', value: char });
                i += 1;
                continue;
            }

            if (char === '-') {
                tokens.push({ type: 'symbol', value: '-' });
                i += 1;
                continue;
            }

            if (isAlphaChar(char)) {
                let word = char;
                i += 1;
                while (i < src.length && isAlphaChar(src[i])) {
                    word += src[i];
                    i += 1;
                }

                const lowerWord = word.toLowerCase();
                if (lowerWord === 'pi') {
                    tokens.push({ type: 'number', value: Math.PI });
                    continue;
                }
                if (lowerWord === 'e') {
                    tokens.push({ type: 'number', value: Math.E });
                    continue;
                }
                if (lowerWord === 'ncr') {
                    tokens.push({ type: 'symbol', value: 'nCr' });
                    continue;
                }
                if (lowerWord === 'npr') {
                    tokens.push({ type: 'symbol', value: 'nPr' });
                    continue;
                }
                tokens.push({ type: 'func', value: lowerWord });
                continue;
            }

            if (char === 'π') {
                tokens.push({ type: 'number', value: Math.PI });
                i += 1;
                continue;
            }

            if (char === '×' || char === 'x') {
                tokens.push({ type: 'symbol', value: '*' });
                i += 1;
                continue;
            }

            if (char === '÷') {
                tokens.push({ type: 'symbol', value: '/' });
                i += 1;
                continue;
            }

            if (char === '√') {
                tokens.push({ type: 'func', value: 'sqrt' });
                i += 1;
                continue;
            }

            throw new Error('Invalid character: ' + char);
        }

        return tokens;
    }

    function toRpn(tokens) {
        const output = [];
        const ops = [];

        for (let i = 0; i < tokens.length; i += 1) {
            const token = tokens[i];

            if (token.type === 'number') {
                output.push(token);
                continue;
            }

            if (token.type === 'func') {
                ops.push(token);
                continue;
            }

            const value = token.value;
            if (value === '(') {
                ops.push(token);
                continue;
            }

            if (value === ')') {
                while (ops.length && ops[ops.length - 1].value !== '(') {
                    output.push(ops.pop());
                }
                if (!ops.length) {
                    throw new Error('Mismatched parentheses');
                }
                ops.pop();
                if (ops.length && ops[ops.length - 1].type === 'func') {
                    output.push(ops.pop());
                }
                continue;
            }

            let op = value;
            if (op === '-') {
                const prev = tokens[i - 1];
                if (!prev || (prev.type === 'symbol' && prev.value !== ')' && prev.value !== '!' && prev.value !== '%')) {
                    op = 'neg';
                }
            }

            const opToken = { type: 'op', value: op };
            const opInfo = OP_INFO[op];
            if (!opInfo) {
                throw new Error('Unknown operator: ' + op);
            }

            while (ops.length) {
                const top = ops[ops.length - 1];
                if (top.value === '(' || top.type === 'func') break;
                const topInfo = OP_INFO[top.value];
                if (!topInfo) break;

                const shouldPop =
                    (opInfo.associativity === 'left' && opInfo.precedence <= topInfo.precedence) ||
                    (opInfo.associativity === 'right' && opInfo.precedence < topInfo.precedence);

                if (!shouldPop) break;
                output.push(ops.pop());
            }

            ops.push(opToken);
        }

        while (ops.length) {
            const token = ops.pop();
            if (token.value === '(' || token.value === ')') {
                throw new Error('Mismatched parentheses');
            }
            output.push(token);
        }

        return output;
    }

    function evalRpn(rpn) {
        const stack = [];

        for (const token of rpn) {
            if (token.type === 'number') {
                stack.push(token.value);
                continue;
            }

            if (token.type === 'func') {
                if (!stack.length) {
                    throw new Error('Invalid function usage');
                }
                const arg = stack.pop();
                const result = funcCall(token.value, arg);
                stack.push(result);
                continue;
            }

            const op = token.value;
            if (!OP_INFO[op]) {
                throw new Error('Invalid operator');
            }

            if (OP_INFO[op].args === 1) {
                if (!stack.length) {
                    throw new Error('Invalid expression');
                }
                const a = stack.pop();

                if (op === 'neg') stack.push(-a);
                else if (op === '!') stack.push(factorial(a));
                else if (op === '%') stack.push(a / 100);
                else throw new Error('Invalid unary operator');

                continue;
            }

            if (stack.length < 2) {
                throw new Error('Invalid expression');
            }

            const b = stack.pop();
            const a = stack.pop();
            let result;

            if (op === '+') result = a + b;
            else if (op === '-') result = a - b;
            else if (op === '*') result = a * b;
            else if (op === '/') {
                if (b === 0) throw new Error('Cannot divide by zero');
                result = a / b;
            } else if (op === '^') result = Math.pow(a, b);
            else if (op === 'nCr') result = nCr(a, b);
            else if (op === 'nPr') result = nPr(a, b);
            else throw new Error('Invalid operator');

            stack.push(result);
        }

        if (stack.length !== 1) {
            throw new Error('Invalid syntax');
        }

        const finalValue = stack[0];
        if (!Number.isFinite(finalValue)) {
            throw new Error('Math overflow');
        }

        return finalValue;
    }

    function evaluateExpression(input) {
        const raw = (input || '').trim();
        if (!raw) {
            throw new Error('Type an expression first');
        }

        const tokens = tokenize(raw);
        const rpn = toRpn(tokens);
        return evalRpn(rpn);
    }

    function formatResult(value) {
        const rounded = Number(value.toFixed(12));
        return Number.isInteger(rounded) ? String(rounded) : String(rounded);
    }

    async function saveCalculation(expression, result) {
        try {
            await fetch('save_calculation.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({ expression, result })
            });
        } catch (_error) {
            // Keep the calculator usable if persistence is unavailable.
        }
    }

    async function loadHistory() {
        try {
            const response = await fetch('fetch_history.php', {
                method: 'GET',
                headers: { Accept: 'application/json' }
            });

            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error('Unable to load history');
            }

            const list = Array.isArray(data.history) ? data.history : [];
            history = list.map(item => {
                if (typeof item === 'string') return item;
                const expression = String(item.expression ?? '').trim();
                const result = String(item.result ?? '').trim();
                return expression && result ? expression + ' = ' + result : String(item);
            }).filter(Boolean);
            writeLocalHistory();
            renderHistory();
        } catch (_error) {
            history = readLocalHistory();
            renderHistory();
        }
    }

    async function tryClearHistoryBackend() {
        try {
            await fetch('clear_history.php', { method: 'POST' });
        } catch (_error) {
            // Endpoint may not exist; local clear still works.
        }
    }

    function setError(message) {
        errorStatus.textContent = message || '';
    }

    function setExpressionLine(text) {
        if (!expressionLine) return;
        expressionLine.textContent = text || 'Ready';
    }

    function updateDisplay(value) {
        display.textContent = value || expr || '0';
        if (!value) {
            setExpressionLine(expr || 'Ready');
        }
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

    function appendExpression(text) {
        expr += text;
        updateDisplay();
        setError('');
    }

    function setMode(mode) {
        modeTabs.forEach(tab => {
            tab.classList.toggle('is-active', tab.getAttribute('data-mode') === mode);
        });

        modePanels.forEach(panel => {
            panel.classList.toggle('is-active', panel.getAttribute('data-panel') === mode);
        });
    }

    function toggleAngleMode() {
        angleMode = angleMode === 'deg' ? 'rad' : 'deg';
        app.setAttribute('data-angle', angleMode);
        angleToggleBtn.textContent = angleMode.toUpperCase();
    }

    async function evaluateCurrent() {
        if (!expr) return;
        try {
            const expression = expr;
            const result = evaluateExpression(expression);
            const formatted = formatResult(result);
            history.unshift(expression + ' = ' + formatted);
            if (history.length > 20) history = history.slice(0, 20);
            renderHistory();
            writeLocalHistory();
            setExpressionLine(expression);
            expr = formatted;
            updateDisplay();
            setError('');
            await saveCalculation(expression, formatted);
        } catch (error) {
            const message = error && error.message ? error.message : 'Invalid expression';
            setError(message);
            setExpressionLine(expr || 'Ready');
            updateDisplay(message);
        }
    }

    function backspace() {
        expr = expr.slice(0, -1);
        updateDisplay();
    }

    function clearExpr() {
        expr = '';
        setExpressionLine('Ready');
        updateDisplay('0');
        setError('');
    }

    function addMemory(delta) {
        try {
            const val = expr ? Number(evaluateExpression(expr)) : 0;
            memoryValue += delta * val;
            updateMemory();
            setError('');
        } catch (error) {
            setError(error.message);
        }
    }

    keypad.addEventListener('click', async event => {
        const target = event.target;
        if (!(target instanceof HTMLButtonElement)) return;

        const action = target.getAttribute('data-action');
        const value = target.getAttribute('data-value');
        const insert = target.getAttribute('data-insert');

        if (action === 'clear') {
            clearExpr();
            return;
        }

        if (action === 'backspace') {
            backspace();
            return;
        }

        if (action === 'equals') {
            await evaluateCurrent();
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

        if (insert) {
            appendExpression(insert);
            return;
        }

        if (value) {
            appendExpression(value);
        }
    });

    modeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            setMode(tab.getAttribute('data-mode'));
        });
    });

    angleToggleBtn.addEventListener('click', toggleAngleMode);

    window.addEventListener('keydown', async event => {
        const key = event.key;

        if ((event.ctrlKey || event.metaKey) && ['c', 'v', 'x', 'a'].includes(key.toLowerCase())) {
            return;
        }

        if (event.key === 'Tab') {
            return;
        }

        if (/^[0-9]$/.test(key) || ['+', '-', '*', '/', '.', '(', ')', '%', '^', '!'].includes(key)) {
            appendExpression(key);
            return;
        }

        if (/^[a-zA-Z]$/.test(key)) {
            appendExpression(key.toLowerCase());
            return;
        }

        if (key === 'Enter') {
            event.preventDefault();
            await evaluateCurrent();
            return;
        }

        if (key === 'Backspace') {
            backspace();
            return;
        }

        if (key === 'Escape') {
            clearExpr();
        }
    });

    clearHistoryBtn.addEventListener('click', () => {
        history = [];
        writeLocalHistory();
        renderHistory();
        tryClearHistoryBackend();
    });

    themeToggleBtn.addEventListener('click', () => {
        const current = root.getAttribute('data-theme') || 'dark';
        setTheme(current === 'dark' ? 'light' : 'dark');
    });

    initTheme();
    updateDisplay('0');
    setExpressionLine('Ready');
    updateMemory();
    setMode('main');
    app.setAttribute('data-angle', angleMode);
    angleToggleBtn.textContent = angleMode.toUpperCase();
    loadHistory();
})();
