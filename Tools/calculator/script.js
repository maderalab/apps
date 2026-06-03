/* Calculator: + − × ÷ and % (modulo / remainder). */

const calcMain = document.getElementById('calcMain');
const calcSub = document.getElementById('calcSub');
const calcKeys = document.getElementById('calcKeys');

let cur = '0';        // the number currently being typed
let prev = null;      // the stored left-hand value
let op = null;        // pending operator
let overwrite = true; // next digit starts a fresh number

const MAX_DIGITS = 12;

function fmtNum(n) {
    if (!isFinite(n)) return 'Error';
    return parseFloat(n.toPrecision(12)).toString(); // trim float noise
}

function render() {
    calcMain.textContent = cur;
    calcSub.textContent = (prev !== null && op) ? `${fmtNum(prev)} ${op}` : '';
    highlightOp();
}

function highlightOp() {
    calcKeys.querySelectorAll('.key.op').forEach((b) =>
        b.classList.toggle('active', !!op && b.dataset.op === op && overwrite));
}

function digitCount(s) {
    return s.replace('-', '').replace('.', '').length;
}

function inputDigit(d) {
    if (cur === 'Error') clearAll();
    if (overwrite) {
        cur = d;
        overwrite = false;
    } else if (cur === '0') {
        cur = d;
    } else if (digitCount(cur) < MAX_DIGITS) {
        cur += d;
    }
    render();
}

function inputDecimal() {
    if (cur === 'Error') clearAll();
    if (overwrite) {
        cur = '0.';
        overwrite = false;
    } else if (!cur.includes('.')) {
        cur += '.';
    }
    render();
}

function clearAll() {
    cur = '0';
    prev = null;
    op = null;
    overwrite = true;
    render();
}

function backspace() {
    if (overwrite || cur === 'Error') return;
    cur = cur.length > 1 ? cur.slice(0, -1) : '0';
    render();
}

function compute(a, b, operator) {
    switch (operator) {
        case '+': return a + b;
        case '−': return a - b;
        case '×': return a * b;
        case '÷': return b === 0 ? NaN : a / b;
        case '%': return b === 0 ? NaN : a % b;
        default: return b;
    }
}

function setOp(nextOp) {
    if (cur === 'Error') return;
    const val = parseFloat(cur);
    if (prev !== null && op && !overwrite) {
        const r = compute(prev, val, op);
        prev = r;
        cur = fmtNum(r);
    } else {
        prev = val;
    }
    op = nextOp;
    overwrite = true;
    render();
}

function equals() {
    if (op === null || prev === null || cur === 'Error') return;
    const b = parseFloat(cur);
    const r = compute(prev, b, op);
    calcSub.textContent = `${fmtNum(prev)} ${op} ${fmtNum(b)} =`;
    cur = fmtNum(r);
    prev = null;
    op = null;
    overwrite = true;
    calcMain.textContent = cur;
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
