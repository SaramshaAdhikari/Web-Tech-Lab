const app = document.querySelector('.app');
const displayEl = document.getElementById('display');
const errorStatusEl = document.getElementById('errorStatus');
const memoryStatusEl = document.getElementById('memoryStatus');
const keypad = document.getElementById('keypad');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistory');
const themeToggleBtn = document.getElementById('themeToggle');

let expression = '';
let memoryValue = 0;
let history = [];

function setError(message) {
  errorStatusEl.textContent = message;
}

function updateDisplay(value = expression || '0') {
  displayEl.textContent = value;
}

function updateMemory() {
  memoryStatusEl.textContent = `M: ${memoryValue}`;
}

function renderHistory() {
  historyList.innerHTML = '';
  if (history.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No calculations yet.';
    historyList.appendChild(li);
    return;
  }
  history.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.expr} = ${item.result}`;
    historyList.appendChild(li);
  });
}

function safeEval(expr) {
  const normalized = expr.replace(/%/g, '/100');
  if (!/^[0-9+\-*/().\s]+$/.test(normalized)) {
    throw new Error('Invalid characters in expression.');
  }
  const result = Function(`"use strict"; return (${normalized})`)();
  if (!Number.isFinite(result)) {
    throw new Error('Math error.');
  }
  return result;
}

function addToHistory(expr, result) {
  history.unshift({ expr, result });
  if (history.length > 15) history = history.slice(0, 15);
  renderHistory();
}

function calculateCurrent() {
  if (!expression.trim()) return;
  try {
    const result = safeEval(expression);
    const formatted = Number.isInteger(result) ? String(result) : String(Number(result.toFixed(8)));
    addToHistory(expression, formatted);
    expression = formatted;
    setError('');
    updateDisplay();
  } catch (error) {
    setError(error.message);
  }
}

function handleAction(action) {
  switch (action) {
    case 'clear':
      expression = '';
      setError('');
      updateDisplay();
      return;
    case 'back':
      expression = expression.slice(0, -1);
      updateDisplay();
      return;
    case 'sign':
      if (!expression) return;
      expression = expression.startsWith('-') ? expression.slice(1) : `-${expression}`;
      updateDisplay();
      return;
    case 'equals':
      calculateCurrent();
      return;
    case 'mc':
      memoryValue = 0;
      updateMemory();
      return;
    case 'mr':
      expression += String(memoryValue);
      updateDisplay();
      return;
    case 'mplus':
      try {
        memoryValue += Number(safeEval(expression || '0'));
        updateMemory();
        setError('');
      } catch (error) {
        setError(error.message);
      }
      return;
    case 'mminus':
      try {
        memoryValue -= Number(safeEval(expression || '0'));
        updateMemory();
        setError('');
      } catch (error) {
        setError(error.message);
      }
      return;
  }
}

keypad.addEventListener('click', event => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;

  const action = target.dataset.action;
  const value = target.dataset.value;

  if (action) {
    handleAction(action);
    return;
  }

  if (value) {
    expression += value;
    setError('');
    updateDisplay();
  }
});

window.addEventListener('keydown', event => {
  const key = event.key;

  if (/^[0-9]$/.test(key) || ['+', '-', '*', '/', '.', '(', ')', '%'].includes(key)) {
    expression += key;
    setError('');
    updateDisplay();
    return;
  }

  if (key === 'Enter') {
    event.preventDefault();
    calculateCurrent();
    return;
  }

  if (key === 'Backspace') {
    expression = expression.slice(0, -1);
    updateDisplay();
    return;
  }

  if (key === 'Escape') {
    expression = '';
    setError('');
    updateDisplay();
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

updateDisplay();
updateMemory();
renderHistory();
