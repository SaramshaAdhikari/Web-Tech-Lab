(function () {
    const screen = document.querySelector('.screen');
    let display = document.getElementById('display');

    if (!display) {
        display = document.createElement('div');
        display.id = 'display';
        screen.appendChild(display);
    }
    display.textContent = '0';

    const buttons = Array.from(document.querySelectorAll('.button'));
    let expr = '';

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const v = btn.textContent.trim();

            if (v === 'C') {
                expr = '';
                display.textContent = '0';
                return;
            }

            if (v === '=') {
                if (!expr) return;
                try {
                    const safeExpr = expr
                        .replace(/x/g, '*')
                        .replace(/×/g, '*')
                        .replace(/÷/g, '/')
                        .replace(/%/g, '/100');
                    const result = Function('return ' + safeExpr)();
                    display.textContent = String(result);
                    expr = String(result);
                } catch (e) {
                    display.textContent = 'Error';
                    expr = '';
                }
                return;
            }

            if (v === '+/-') {
                if (!expr) return;
                if (expr[0] === '-') expr = expr.slice(1);
                else expr = '-' + expr;
                display.textContent = expr;
                return;
            }

            if (v === '()') {
                const opens = (expr.match(/\(/g) || []).length;
                const closes = (expr.match(/\)/g) || []).length;
                expr += opens > closes ? ')' : '(';
                display.textContent = expr || '0';
                return;
            }

            const mapped = v === 'x' ? '*' : (v === '÷' ? '/' : v);
            expr += mapped;
            display.textContent = expr || '0';
        });
    });
})();
