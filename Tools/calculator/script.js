/* Calculator: + − × ÷ and % (modulo / remainder).
   Builds a full multi-term expression in the upper line (calcSub) and
   evaluates it with operator precedence (× ÷ % before + −) on "=".
   The lower line (calcMain) shows results only — never the raw input. */

const calcMain = document.getElementById('calcMain');
const calcSub = document.getElementById('calcSub');
const calcKeys = document.getElementById('calcKeys');

let tokens = [];          // committed expression: number, op, number, op, …
let cur = '';             // the number currently being typed
let result = '';          // lower line: result / 'Error' / blank
let justEvaluated = false; // true right after "=" (next input continues/replaces)

const OPS = ['+', '−', '×', '÷', '%'];
const MAX_DIGITS = 12;

function isOp(t) {
    return OPS.includes(t);
}

function fmtNum(n) {
    if (!isFinite(n)) return 'Error';
    return parseFloat(n.toPrecision(12)).toString(); // trim float noise
}

function digitCount(s) {
    return s.replace('-', '').replace('.', '').length;
}

function render() {
    const parts = tokens.slice();
    if (cur !== '') parts.push(cur);
    calcSub.textContent = parts.join(' ');
    calcMain.textContent = result;   // lower line: result only
    highlightOp();
}

function highlightOp() {
    const last = tokens[tokens.length - 1];
    const active = (cur === '' && isOp(last)) ? last : null;
    calcKeys.querySelectorAll('.key.op').forEach((b) =>
        b.classList.toggle('active', b.dataset.op === active));
}

function startFresh() {
    tokens = [];
    cur = '';
    result = '';
    justEvaluated = false;
}

function inputDigit(d) {
    if (result === 'Error') clearAll();
    if (justEvaluated) startFresh();
    if (cur === '0') {
        cur = d;                       // replace a lone leading zero
    } else if (digitCount(cur) < MAX_DIGITS) {
        cur += d;
    }
    render();
}

function inputDecimal() {
    if (result === 'Error') clearAll();
    if (justEvaluated) startFresh();
    if (cur === '') {
        cur = '0.';
    } else if (!cur.includes('.')) {
        cur += '.';
    }
    render();
}

function clearAll() {
    startFresh();
    render();
}

function backspace() {
    if (result === 'Error' || justEvaluated) { clearAll(); return; }
    if (cur !== '') {
        cur = cur.slice(0, -1);
    } else if (tokens.length) {
        const popped = tokens.pop();
        if (isOp(popped) && tokens.length) cur = tokens.pop(); // re-open the number
    }
    render();
}

function setOp(nextOp) {
    if (result === 'Error') return;
    if (justEvaluated) {
        tokens = [result];             // continue from the last answer
        justEvaluated = false;
    }
    if (cur !== '') {
        tokens.push(cur);
        cur = '';
    } else if (tokens.length === 0) {
        tokens.push('0');              // allow starting like "0 +"
    }
    const last = tokens[tokens.length - 1];
    if (isOp(last)) {
        tokens[tokens.length - 1] = nextOp;   // just swap the pending operator
    } else {
        tokens.push(nextOp);
    }
    result = '';                       // clear the result line after an operator
    render();
}

// Evaluate a flat token list with two precedence passes.
function evaluate(expr) {
    // pass 1: × ÷ %
    const out = [expr[0]];
    for (let i = 1; i < expr.length; i += 2) {
        const o = expr[i];
        const n = parseFloat(expr[i + 1]);
        if (o === '×' || o === '÷' || o === '%') {
            const a = parseFloat(out.pop());
            let r;
            if (o === '×') r = a * n;
            else if (o === '÷') r = n === 0 ? NaN : a / n;
            else r = n === 0 ? NaN : a % n;
            out.push(r);
        } else {
            out.push(o, n);
        }
    }
    // pass 2: + −
    let acc = parseFloat(out[0]);
    for (let i = 1; i < out.length; i += 2) {
        const o = out[i];
        const n = parseFloat(out[i + 1]);
        if (o === '+') acc += n;
        else if (o === '−') acc -= n;
    }
    return acc;
}

function equals() {
    const expr = tokens.slice();
    if (cur !== '') expr.push(cur);
    if (expr.length && isOp(expr[expr.length - 1])) expr.pop(); // drop trailing op
    if (expr.length < 3) return;       // need at least "num op num"

    const r = evaluate(expr);
    calcSub.textContent = expr.join(' ') + ' =';
    if (!isFinite(r)) { setError(); return; }
    result = fmtNum(r);
    calcMain.textContent = result;
    tokens = [];
    cur = '';
    justEvaluated = true;
    highlightOp();
}

function setError() {
    tokens = [];
    cur = '';
    result = 'Error';
    justEvaluated = false;
    calcMain.textContent = 'Error';
    highlightOp();
}

calcKeys.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.dataset.num !== undefined) inputDigit(btn.dataset.num);
    else if (btn.dataset.op !== undefined) setOp(btn.dataset.op);
    else if (btn.dataset.action === 'clear') clearAll();
    else if (btn.dataset.action === 'back') backspace();
    else if (btn.dataset.action === 'decimal') inputDecimal();
    else if (btn.dataset.action === 'equals') equals();
});

// Keyboard support (handy on desktop)
const KEY_OPS = { '+': '+', '-': '−', '*': '×', '/': '÷', '%': '%' };
window.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') inputDigit(e.key);
    else if (e.key === '.') inputDecimal();
    else if (KEY_OPS[e.key]) setOp(KEY_OPS[e.key]);
    else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); equals(); }
    else if (e.key === 'Backspace') backspace();
    else if (e.key === 'Escape') clearAll();
});

render();
