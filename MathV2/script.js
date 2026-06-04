// Math Quiz - Question Generation and State Management
const QUESTION_COUNT = 100;
const STORAGE_KEY = 'mathQuizProgress_v4'; // v4: 9 curriculum-staged levels
const MODE_KEY = STORAGE_KEY + ':mode';    // remembers the last-used level
const setKey = (mode) => `${STORAGE_KEY}:${mode}`; // each level cached on its own key
const EPS = 1e-9; // numeric tolerance for answer comparison
// The nine levels follow the K–12 throughline (see math_k12_topics_detailed.md).
// keys: which extended number-pad keys the level needs (± . /).
const MODE_CONFIG = {
    early:    { name: 'Early Math',  grade: 'Gr K–2',   core: 'Counting, Add & Subtract',          color: '#00bcd4' },
    basics:   { name: 'Basic',       grade: 'Gr 3–5',   core: 'Whole-Number Fluency & Fractions',  color: '#e74c3c' },
    advanced: { name: 'Advanced',    grade: 'Gr 3–5',   core: 'Fraction & Decimal Operations',     color: '#e67e22' },
    ratios:   { name: 'Ratios',      grade: 'Gr 6–7',   core: 'Ratios, Proportions & Percents',    color: '#f39c12' },
    linear:   { name: 'Pre-Algebra', grade: 'Gr 8',     core: 'Linear Functions (Grade 8)',        color: '#16a085' },
    algebra1: { name: 'Algebra I',   grade: 'Gr 9',     core: 'Quadratics, Exponents & Functions', color: '#27ae60' },
    geometry: { name: 'Geometry',    grade: 'Gr 10',    core: 'Angles, Triangles & Trig',          color: '#2980b9' },
    algebra2: { name: 'Algebra II',  grade: 'Gr 11',    core: 'Exponentials, Logs & Polynomials',  color: '#8e44ad' },
    precalc:  { name: 'Precalculus', grade: 'Gr 11–12', core: 'Series, Matrices & Trig',           color: '#d81b60' },
    calculus: { name: 'Calculus',    grade: 'Gr 12',    core: 'Derivatives, Integrals & Stats',    color: '#34495e' },
};
const MODES = Object.keys(MODE_CONFIG);

class MathQuiz {
    constructor() {
        // One independent question set per level, each cached separately.
        this.sets = { basic: null, advanced: null, middle: null };
        this.currentIndex = 0;

        // Reopen the level the user was last on; resume today's set or start fresh.
        const savedMode = localStorage.getItem(MODE_KEY);
        this.mode = MODES.includes(savedMode) ? savedMode : MODES[0];
        this.ensureSet(this.mode);
        this.applyActiveSet();
        this.init();
    }

    modeLabel() { return MODE_CONFIG[this.mode].name; }

    // Local date as YYYY-MM-DD — the cache key for "today"
    todayKey() {
        const d = new Date();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }

    // True when a saved set object is well-formed (and uses the LaTeX schema).
    isValidSet(s) {
        return s && Array.isArray(s.questions) && s.questions.length === QUESTION_COUNT
            && typeof s.questions[0].latex === 'string';
    }

    // Load one level's cached set if it belongs to today; else null.
    loadSet(mode) {
        try {
            const raw = localStorage.getItem(setKey(mode));
            if (!raw) return null;
            const data = JSON.parse(raw);
            // A new day ⇒ discard so the level regenerates a fresh set.
            if (!data || data.date !== this.todayKey()) return null;
            return this.isValidSet(data.set) ? data.set : null;
        } catch (e) {
            return null; // corrupted / unavailable storage → fresh start
        }
    }

    // Persist one level's set under its own key (with today's date).
    // Persists only — the caller must snapshotActiveSet() first when the live
    // working state needs to be flushed into the active level.
    saveSet(mode) {
        try {
            localStorage.setItem(setKey(mode), JSON.stringify({
                date: this.todayKey(),
                set: this.sets[mode]
            }));
        } catch (e) { /* ignore quota / private-mode errors */ }
    }

    // Make sure a level has a set loaded — from today's cache or freshly made.
    ensureSet(mode) {
        if (this.sets[mode]) return;
        const cached = this.loadSet(mode);
        if (cached) {
            this.sets[mode] = cached;
        } else {
            this.sets[mode] = this.generateSet(mode);
            this.saveSet(mode);
        }
    }

    // Persist the active level's progress plus the last-used-level pointer.
    saveProgress() {
        this.snapshotActiveSet();   // flush live working state into the active set
        this.saveSet(this.mode);
        try { localStorage.setItem(MODE_KEY, this.mode); } catch (e) { /* ignore */ }
    }

    // Copy the active set into the working fields.
    applyActiveSet() {
        const s = this.sets[this.mode];
        this.questions = s.questions;
        this.answers = s.answers;
        this.correct = s.correct;
        this.currentIndex = s.currentIndex || 0;
    }

    // Write the working fields back into the active set.
    snapshotActiveSet() {
        this.sets[this.mode] = {
            questions: this.questions,
            answers: this.answers,
            correct: this.correct,
            currentIndex: this.currentIndex
        };
    }

    // Build a fresh 100-question set for the given mode.
    generateSet(mode) {
        const gen = {
            early: () => this.genK2(),
            basics: () => this.genBasics(),
            advanced: () => this.genAdvanced(),
            ratios: () => this.genRatios(),
            linear: () => this.genLinear(),
            algebra1: () => this.genAlgebra1(),
            geometry: () => this.genGeometry(),
            algebra2: () => this.genAlgebra2(),
            precalc: () => this.genPrecalc(),
            calculus: () => this.genCalculus(),
        }[mode] || (() => this.genBasics());
        // Strict gate: only accept a well-formed question (finite numeric
        // answer, present LaTeX); retry a generator that returns otherwise.
        const make = () => {
            for (let tries = 0; tries < 25; tries++) {
                const it = gen();
                if (it && typeof it.latex === 'string' && Number.isFinite(it.answer)) return it;
            }
            return gen();
        };
        const questions = [];
        for (let i = 0; i < QUESTION_COUNT; i++) questions.push(make());
        return {
            questions,
            answers: new Array(QUESTION_COUNT).fill(null),
            correct: new Array(QUESTION_COUNT).fill(false),
            currentIndex: 0
        };
    }

    // Switch levels — each keeps its own independently-cached progress.
    setMode(mode) {
        if (!MODES.includes(mode) || mode === this.mode) return;
        this.snapshotActiveSet();  // capture the level we're leaving
        this.saveSet(this.mode);
        this.mode = mode;
        this.ensureSet(mode);      // load today's cache or freshly generate
        this.applyActiveSet();

        document.getElementById('completionOverlay').style.display = 'none';
        this.updateModeUI();
        this.renderQuestion();
        this.updateStats();
        this.renderRecordList();
        this.saveProgress();
    }

    // ---- Random helpers -------------------------------------------------
    ri(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    riNZ(min, max) { let v; do { v = this.ri(min, max); } while (v === 0); return v; } // nonzero
    // Map a display symbol to its LaTeX command (KaTeX typesets the result).
    op(sym) { return ({ '+': '+', '−': '-', '×': '\\times', '÷': '\\div', '=': '=' })[sym] || sym; }
    paren(n) { return n < 0 ? `(${n})` : `${n}`; } // wrap negative operands

    // ---- Math helpers shared across levels ------------------------------
    gcd(a, b) { a = Math.abs(a); b = Math.abs(b); return b === 0 ? a : this.gcd(b, a % b); }
    round1(x) { return Math.round(x * 10) / 10; }
    round2(x) { return Math.round(x * 100) / 100; }
    // Reduce a fraction to lowest terms with a positive denominator → [num, den].
    reduceFrac(num, den) { if (den < 0) { num = -num; den = -den; } const g = this.gcd(num, den) || 1; return [num / g, den / g]; }
    // Reduced fraction as text ("p/q", or "p" when whole) for grading/feedback.
    fracText(num, den) { const [n, d] = this.reduceFrac(num, den); return d === 1 ? `${n}` : `${n}/${d}`; }
    // Leading polynomial term: 3 → "3", -1 with 'x' → "-x", 1 with 'x' → "x".
    leadTerm(coef, suffix = '') { const a = Math.abs(coef); const body = (a === 1 && suffix) ? '' : a; return `${coef < 0 ? '-' : ''}${body}${suffix}`; }
    // Following term with its sign: 3,'x' → " + 3x"; -5 → " - 5"; 0 → "".
    signTerm(coef, suffix = '') { if (coef === 0) return ''; const a = Math.abs(coef); const body = (a === 1 && suffix) ? '' : a; return ` ${coef < 0 ? '-' : '+'} ${body}${suffix}`; }
    factorial(n) { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; }
    choose(n, k) { return Math.round(this.factorial(n) / (this.factorial(k) * this.factorial(n - k))); }
    pick(arr) { return arr[this.ri(0, arr.length - 1)]; }
    // Pythagorean triples reused for clean integer side / distance / magnitude.
    triple() { return this.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [7, 24, 25], [9, 12, 15], [20, 21, 29], [9, 40, 41], [12, 16, 20]]); }

    // ====================================================================
    // 0 · EARLY MATH — Counting, Add/Subtract, Place Value (Gr K–2)
    // ====================================================================
    genK2() {
        switch (this.ri(0, 5)) {
            case 0: return this.k2Add();
            case 1: return this.k2Sub();
            case 2: return this.k2Missing();
            case 3: return this.k2Skip();
            case 4: return this.k2Place();
            case 5: return this.k2Compare();
        }
    }

    k2Add() {
        let a, b;
        if (Math.random() < 0.5) { a = this.ri(1, 10); b = this.ri(1, 20 - a); }   // within 20
        else { a = this.ri(10, 90); b = this.ri(1, 100 - a); }                      // within 100
        return { question: `${a}+${b}`, latex: `${a} + ${b}`, answer: a + b, type: 'k2-add' };
    }

    k2Sub() {
        let a, b;
        if (Math.random() < 0.5) { a = this.ri(2, 20); b = this.ri(1, a - 1); }
        else { a = this.ri(20, 100); b = this.ri(1, a - 1); }
        return { question: `${a}-${b}`, latex: `${a} - ${b}`, answer: a - b, type: 'k2-sub' };
    }

    k2Missing() {
        const c = this.ri(5, 20), a = this.ri(1, c - 1);
        return { question: `${a}+?=${c}`, latex: `${a} + \\square = ${c}`, hint: '\\square = \\;?', answer: c - a, type: 'k2-missing' };
    }

    k2Skip() {
        const step = this.pick([2, 5, 10]), start = this.ri(0, 6) * step;
        const t = [start, start + step, start + 2 * step, start + 3 * step];
        return { question: `${t[0]},${t[1]},${t[2]},?`, latex: `${t[0]}, \\; ${t[1]}, \\; ${t[2]}, \\; \\square`, hint: '\\square = \\;?', answer: t[3], type: 'k2-skip' };
    }

    k2Place() {
        if (Math.random() < 0.5) {
            const t = this.ri(1, 9), o = this.ri(0, 9);
            return { question: `${t} tens ${o} ones`, latex: `${t} \\text{ tens} + ${o} \\text{ ones}`, hint: '= \\;?', answer: 10 * t + o, type: 'k2-place' };
        }
        const n = this.ri(11, 99), tens = Math.random() < 0.5;
        return { question: `${tens ? 'tens' : 'ones'} of ${n}`, latex: `\\text{${tens ? 'Tens' : 'Ones'} digit of } ${n}`, hint: '= \\;?', answer: tens ? Math.floor(n / 10) : n % 10, type: 'k2-place' };
    }

    k2Compare() {
        const a = this.ri(1, 99), b = this.ri(1, 99);
        if (a === b) return this.k2Compare();
        const greater = Math.random() < 0.5;
        return { question: `${greater ? 'greater' : 'smaller'} ${a},${b}`, latex: `\\text{${greater ? 'Greater' : 'Smaller'} of } ${a} \\text{ and } ${b}`, hint: '= \\;?', answer: greater ? Math.max(a, b) : Math.min(a, b), type: 'k2-compare' };
    }

    // ====================================================================
    // 1 · BASICS — Whole-Number Fluency & Fraction Foundations (Gr 3–5)
    // ====================================================================
    genBasics() {
        switch (this.ri(0, 7)) {
            case 0: { const a = this.ri(2, 12), b = this.ri(2, 12); return { question: `${a}x${b}`, latex: `${a} \\times ${b}`, answer: a * b, type: 'mult-fact' }; }
            case 1: { const a = this.ri(11, 999), b = this.ri(2, 9); return { question: `${a}x${b}`, latex: `${a} \\times ${b}`, answer: a * b, type: 'mult' }; }
            case 2: { const d = this.ri(2, 12), q = this.ri(2, 12); return { question: `${d * q}/${d}`, latex: `${d * q} \\div ${d}`, answer: q, type: 'div-fact' }; }
            case 3: return this.bAddSub();
            case 4: return this.bRounding();
            case 5: return this.bEquivFraction();
            case 6: return this.bRectangle();
            case 7: return this.bMoney();
        }
    }

    bAddSub() {
        let a, b, ans, sym;
        if (Math.random() < 0.5) { a = this.ri(20, 899); b = this.ri(20, 1000 - a); ans = a + b; sym = '+'; }
        else { a = this.ri(200, 999); b = this.ri(20, a - 1); ans = a - b; sym = '-'; }
        return { question: `${a}${sym}${b}`, latex: `${a} ${sym} ${b}`, answer: ans, type: 'add-sub' };
    }

    bRounding() {
        const place = this.pick([10, 100, 1000]);
        const n = this.ri(place === 1000 ? 1200 : 120, 9876);
        const ans = Math.round(n / place) * place;
        return { question: `round ${n} to ${place}`, latex: `\\text{Round } ${n} \\text{ to the nearest } ${place}`, hint: '= \\;?', answer: ans, type: 'rounding' };
    }

    bEquivFraction() {
        const d = this.ri(2, 6); let n; do { n = this.ri(1, d - 1); } while (this.gcd(n, d) !== 1);
        const m = this.ri(2, 5);
        return { question: `${n}/${d}=?/${d * m}`, latex: `\\dfrac{${n}}{${d}} = \\dfrac{?}{${d * m}}`, hint: '? = \\;', answer: n * m, type: 'equiv-frac' };
    }

    bRectangle() {
        const w = this.ri(2, 20), h = this.ri(2, 20);
        if (Math.random() < 0.5) return { question: `area ${w}x${h}`, latex: `\\text{Area of a } ${w} \\times ${h} \\text{ rectangle}`, hint: '= \\;?', answer: w * h, type: 'area' };
        return { question: `perim ${w}x${h}`, latex: `\\text{Perimeter of a } ${w} \\times ${h} \\text{ rectangle}`, hint: '= \\;?', answer: 2 * (w + h), type: 'perimeter' };
    }

    bMoney() {
        let a = this.round2(this.ri(25, 995) / 100), b = this.round2(this.ri(25, 995) / 100);
        const sub = Math.random() < 0.5;
        if (sub && a < b) { const t = a; a = b; b = t; }
        const ans = this.round2(sub ? a - b : a + b);
        return { question: `${a}${sub ? '-' : '+'}${b}`, latex: `\\$${a} ${sub ? '-' : '+'} \\$${b}`, answer: ans, type: 'money' };
    }

    // ====================================================================
    // 2 · ADVANCED — Fraction & Decimal Operations (Gr 3–5 stretch)
    // ====================================================================
    genAdvanced() {
        switch (this.ri(0, 6)) {
            case 0: case 1: return this.aFraction();
            case 2: case 3: return this.aDecimal();
            case 4: { const g = this.ri(2, 12), x = g * this.ri(2, 9), y = g * this.ri(2, 9); return { question: `gcf ${x},${y}`, latex: `\\text{GCF}(${x}, ${y})`, hint: '= \\;?', answer: this.gcd(x, y), type: 'gcf' }; }
            case 5: { const a = this.ri(3, 12), b = this.ri(3, 12); return { question: `lcm ${a},${b}`, latex: `\\text{LCM}(${a}, ${b})`, hint: '= \\;?', answer: a * b / this.gcd(a, b), type: 'lcm' }; }
            case 6: { const l = this.ri(2, 9), w = this.ri(2, 9), h = this.ri(2, 9); return { question: `vol ${l}x${w}x${h}`, latex: `\\text{Volume: } ${l} \\times ${w} \\times ${h}`, hint: '= \\;?', answer: l * w * h, type: 'volume' }; }
        }
    }

    aFraction() {
        const k = this.ri(0, 3);
        let d1 = this.ri(2, 9), n1; do { n1 = this.ri(1, d1 - 1); } while (this.gcd(n1, d1) !== 1);
        let d2 = this.ri(2, 9), n2; do { n2 = this.ri(1, d2 - 1); } while (this.gcd(n2, d2) !== 1);
        let num, den, sym;
        if (k === 0) { num = n1 * d2 + n2 * d1; den = d1 * d2; sym = '+'; }
        else if (k === 1) { if (n1 * d2 < n2 * d1) { [n1, d1, n2, d2] = [n2, d2, n1, d1]; } num = n1 * d2 - n2 * d1; den = d1 * d2; sym = '-'; if (num === 0) return this.aFraction(); }
        else if (k === 2) { num = n1 * n2; den = d1 * d2; sym = '\\times'; }
        else { num = n1 * d2; den = d1 * n2; sym = '\\div'; }
        const [rn, rd] = this.reduceFrac(num, den);
        return { question: `${n1}/${d1} ${sym} ${n2}/${d2}`, latex: `\\dfrac{${n1}}{${d1}} ${sym} \\dfrac{${n2}}{${d2}}`, answer: rn / rd, answerText: this.fracText(num, den), type: 'fraction' };
    }

    aDecimal() {
        const k = this.ri(0, 3);
        let a, b, ans, sym;
        if (k === 3) { a = this.round2(this.ri(11, 999) / 100); b = this.ri(2, 9); ans = this.round2(a * b); sym = '\\times'; }
        else if (k === 2) { b = this.ri(2, 9); const q = this.round1(this.ri(11, 99) / 10); a = this.round1(b * q); ans = this.round1(a / b); sym = '\\div'; }
        else { a = this.round1(this.ri(1, 99) / 10); b = this.round1(this.ri(1, 99) / 10); if (k === 1 && a < b) { const t = a; a = b; b = t; } ans = this.round1(k === 1 ? a - b : a + b); sym = k === 1 ? '-' : '+'; }
        return { question: `${a} ${sym} ${b}`, latex: `${a} ${sym} ${b}`, answer: ans, type: 'decimal' };
    }

    // ====================================================================
    // 3 · RATIOS — Ratios, Proportions, Percents & Rational Numbers (Gr 6–7)
    // ====================================================================
    genRatios() {
        switch (this.ri(0, 6)) {
            case 0: { const p = this.pick([5, 10, 20, 25, 50]); const m = this.ri(3, 40); const n = (100 / p) * m; return { question: `${p}% of ${n}`, latex: `${p}\\% \\text{ of } ${n}`, answer: m, type: 'percent-of' }; }
            case 1: { const p = this.pick([5, 10, 20, 25, 50]); const m = this.ri(2, 20); const n = (100 / p) * m; return { question: `what % of ${n} is ${m}`, latex: `\\text{What percent of } ${n} \\text{ is } ${m}?`, answer: p, type: 'what-percent' }; }
            case 2: { const b = this.ri(2, 9); let a; do { a = this.ri(1, 9); } while (this.gcd(a, b) !== 1); const m = this.ri(2, 6); return { question: `${a}/${b}=x/${b * m}`, latex: `\\dfrac{${a}}{${b}} = \\dfrac{x}{${b * m}}`, hint: 'x = \\;?', answer: a * m, type: 'proportion' }; }
            case 3: { const rate = this.ri(2, 60), h = this.ri(2, 9); return { question: `${rate * h} mi/${h} h`, latex: `${rate * h} \\text{ miles in } ${h} \\text{ hours}`, hint: '\\text{mph} = \\;?', answer: rate, type: 'unit-rate' }; }
            case 4: return this.rPercentApp();
            case 5: return this.atomSigned();
            case 6: return this.atomLinearEq();
        }
    }

    rPercentApp() {
        const base = this.ri(2, 40) * 5;       // multiple of 5 dollars
        const p = this.pick([10, 15, 20, 25, 50]);
        if (Math.random() < 0.5) { const ans = this.round2(base * p / 100); return { question: `${p}% tip on ${base}`, latex: `${p}\\% \\text{ tip on } \\$${base}`, hint: '= \\;?', answer: ans, type: 'tip' }; }
        const ans = this.round2(base * (100 - p) / 100);
        return { question: `${base} - ${p}%`, latex: `\\$${base} \\text{ with } ${p}\\% \\text{ off}`, hint: '= \\;?', answer: ans, type: 'discount' };
    }

    // ====================================================================
    // 4 · PRE-ALGEBRA — Linear Functions, Systems, Roots, Pythagoras (Gr 8)
    // ====================================================================
    genLinear() {
        switch (this.ri(0, 6)) {
            case 0: return this.lMultiStep();
            case 1: return this.lSystem();
            case 2: return this.lFuncEval();
            case 3: return this.lSciNotation();
            case 4: return this.lSlope();
            case 5: return this.atomRoot();
            case 6: return this.atomExponent();
        }
    }

    // Slope (rate of change) through two points — a Grade-8 functions topic.
    lSlope() {
        const m = this.ri(-5, 5), x1 = this.ri(-6, 6); let x2 = this.ri(-6, 6); if (x2 === x1) x2 = x1 + 1;
        const y1 = this.ri(-9, 9), y2 = y1 + m * (x2 - x1);
        return { question: `slope (${x1},${y1})(${x2},${y2})`, latex: `\\text{Slope through } (${x1}, ${y1}) \\text{ and } (${x2}, ${y2})`, hint: 'm = \\;?', answer: m, type: 'slope' };
    }

    lMultiStep() {
        const x = this.ri(-8, 9); let a = this.ri(2, 9), c = this.ri(1, 8); if (a === c) c = a + 1;
        const b = this.ri(-9, 9), d = (a - c) * x + b;
        return { question: `${a}x+${b}=${c}x+${d}`, latex: `${this.leadTerm(a, 'x')}${this.signTerm(b)} = ${this.leadTerm(c, 'x')}${this.signTerm(d)}`, hint: 'x = \\;?', answer: x, type: 'linear-eq' };
    }

    lSystem() {
        const x = this.ri(-6, 8), y = this.ri(-6, 8);
        const a1 = this.ri(1, 5), b1 = this.ri(1, 5), a2 = this.ri(1, 5), b2 = this.ri(1, 5);
        if (a1 * b2 - a2 * b1 === 0) return this.lSystem();
        const e1 = `${this.leadTerm(a1, 'x')}${this.signTerm(b1, 'y')} = ${a1 * x + b1 * y}`;
        const e2 = `${this.leadTerm(a2, 'x')}${this.signTerm(b2, 'y')} = ${a2 * x + b2 * y}`;
        return { question: `system`, latex: `\\begin{cases} ${e1} \\\\ ${e2} \\end{cases}`, hint: 'x = \\;?', answer: x, type: 'system' };
    }

    lFuncEval() {
        const m = this.ri(2, 6) * (Math.random() < 0.35 ? -1 : 1), b = this.ri(-8, 9), k = this.ri(-4, 6);
        return { question: `f(x)=${m}x+${b}; f(${k})`, latex: `f(x) = ${this.leadTerm(m, 'x')}${this.signTerm(b)}`, hint: `f(${k}) = \\;?`, answer: m * k + b, type: 'func-eval' };
    }

    lSciNotation() {
        const mant = this.round1(this.ri(11, 99) / 10), n = this.ri(2, 4);
        return { question: `${mant}e${n}`, latex: `${mant} \\times 10^{${n}}`, hint: '= \\;?', answer: this.round2(mant * Math.pow(10, n)), type: 'sci-notation' };
    }

    // ====================================================================
    // 5 · ALGEBRA I — Quadratics, Exponent Rules, Polynomials, Exponentials
    // ====================================================================
    genAlgebra1() {
        switch (this.ri(0, 4)) {
            case 0: return this.gQuadratic();
            case 1: return this.gExpRule();
            case 2: return this.gPolyEval();
            case 3: return this.gExponential();
            case 4: { const a = this.ri(1, 6), b = this.ri(-9, 9), c = this.ri(-9, 9); return { question: `disc ${a},${b},${c}`, latex: `\\text{Discriminant of } ${this.leadTerm(a, 'x^2')}${this.signTerm(b, 'x')}${this.signTerm(c)}`, hint: 'b^2 - 4ac = \\;?', answer: b * b - 4 * a * c, type: 'discriminant' }; }
        }
    }

    gQuadratic() {
        let r1 = this.ri(-7, 7), r2 = this.ri(-7, 7); if (r1 === r2) r2 += 1;
        const b = -(r1 + r2), c = r1 * r2;
        return { question: `x^2+${b}x+${c}=0`, latex: `x^2${this.signTerm(b, 'x')}${this.signTerm(c)} = 0`, hint: '\\text{greater root } x = \\;?', answer: Math.max(r1, r2), type: 'quadratic' };
    }

    gExpRule() {
        const base = this.ri(2, 6);
        switch (this.ri(0, 2)) {
            case 0: { const e1 = this.ri(2, 5), e2 = this.ri(2, 5); return { question: `${base}^${e1}*${base}^${e2}`, latex: `${base}^{${e1}} \\cdot ${base}^{${e2}} = ${base}^{n}`, hint: 'n = \\;?', answer: e1 + e2, type: 'exp-rule' }; }
            case 1: { const e1 = this.ri(5, 9), e2 = this.ri(2, 4); return { question: `${base}^${e1}/${base}^${e2}`, latex: `\\dfrac{${base}^{${e1}}}{${base}^{${e2}}} = ${base}^{n}`, hint: 'n = \\;?', answer: e1 - e2, type: 'exp-rule' }; }
            default: { const e1 = this.ri(2, 4), e2 = this.ri(2, 3); return { question: `(${base}^${e1})^${e2}`, latex: `(${base}^{${e1}})^{${e2}} = ${base}^{n}`, hint: 'n = \\;?', answer: e1 * e2, type: 'exp-rule' }; }
        }
    }

    gPolyEval() {
        const a = this.ri(1, 4), b = this.ri(-5, 5), c = this.ri(-6, 6), k = this.ri(-3, 4);
        return { question: `poly f(${k})`, latex: `f(x) = ${this.leadTerm(a, 'x^2')}${this.signTerm(b, 'x')}${this.signTerm(c)}`, hint: `f(${k}) = \\;?`, answer: a * k * k + b * k + c, type: 'poly-eval' };
    }

    gExponential() {
        const a = this.ri(1, 4), base = this.ri(2, 4), k = this.ri(1, 3);
        const lhs = a === 1 ? `${base}^{x}` : `${a} \\cdot ${base}^{x}`;
        return { question: `${a}*${base}^x; x=${k}`, latex: `f(x) = ${lhs}`, hint: `f(${k}) = \\;?`, answer: a * Math.pow(base, k), type: 'exponential' };
    }

    // ====================================================================
    // 6 · GEOMETRY — Angles, Triangles, Circles & Clean Trig
    // ====================================================================
    genGeometry() {
        switch (this.ri(0, 6)) {
            case 0: { const a = this.ri(1, 89); return { question: `comp ${a}`, latex: `\\text{Complement of } ${a}^{\\circ}`, hint: '= \\;?', answer: 90 - a, type: 'complement' }; }
            case 1: { const a = this.ri(1, 179); return { question: `supp ${a}`, latex: `\\text{Supplement of } ${a}^{\\circ}`, hint: '= \\;?', answer: 180 - a, type: 'supplement' }; }
            case 2: { const a = this.ri(30, 120), b = this.ri(20, 150 - a < 20 ? 20 : 150 - a); const bb = Math.min(b, 178 - a); return { question: `tri ${a},${bb}`, latex: `\\text{Triangle angles } ${a}^{\\circ}, ${bb}^{\\circ}, \\; ?`, hint: '= \\;?', answer: 180 - a - bb, type: 'angle-sum' }; }
            case 3: { const [p, q, r] = this.triple(); return { question: `hyp ${p},${q}`, latex: `\\text{Right triangle, legs } ${p} \\text{ and } ${q}`, hint: '\\text{hypotenuse} = \\;?', answer: r, type: 'pythagoras' }; }
            case 4: { const r = this.ri(2, 12); if (Math.random() < 0.5) return { question: `circ r=${r}`, latex: `\\text{Circumference, } r = ${r}`, hint: '= \\;?\\,\\pi', answer: 2 * r, type: 'circle-circ' }; return { question: `area r=${r}`, latex: `\\text{Circle area, } r = ${r}`, hint: '= \\;?\\,\\pi', answer: r * r, type: 'circle-area' }; }
            case 5: { const c = this.ri(1, 89) * 2; return { question: `inscribed ${c}`, latex: `\\text{Inscribed angle, central } ${c}^{\\circ}`, hint: '= \\;?', answer: c / 2, type: 'inscribed' }; }
            case 6: return this.gTrig();
        }
    }

    gTrig() {
        const opts = [
            ['\\sin', 0, 0], ['\\sin', 30, 0.5], ['\\sin', 90, 1],
            ['\\cos', 0, 1], ['\\cos', 60, 0.5], ['\\cos', 90, 0],
            ['\\tan', 0, 0], ['\\tan', 45, 1],
        ];
        const [fn, deg, val] = this.pick(opts);
        return { question: `${fn}${deg}`, latex: `${fn} ${deg}^{\\circ}`, hint: '= \\;?', answer: val, type: 'trig' };
    }

    // ====================================================================
    // 7 · ALGEBRA II — Exponentials, Logs, Polynomials, Sequences
    // ====================================================================
    genAlgebra2() {
        switch (this.ri(0, 5)) {
            case 0: { const b = this.ri(2, 5), k = this.ri(2, 5); return { question: `log_${b}(${b ** k})`, latex: `\\log_{${b}}(${b ** k})`, hint: '= \\;?', answer: k, type: 'log' }; }
            case 1: { const b = this.ri(2, 5), x = this.ri(2, 5); return { question: `${b}^x=${b ** x}`, latex: `${b}^{x} = ${b ** x}`, hint: 'x = \\;?', answer: x, type: 'exp-eq' }; }
            case 2: { const r = this.ri(2, 5), q = this.pick([2, 3]), p = q === 2 ? this.pick([1, 3]) : this.pick([1, 2]); return { question: `${r ** q}^(${p}/${q})`, latex: `${r ** q}^{${p}/${q}}`, hint: '= \\;?', answer: r ** p, type: 'rational-exp' }; }
            case 3: { const a = this.ri(-4, 5), b = this.ri(-6, 6), k = this.pick([-3, -2, -1, 1, 2, 3, 4]); return { question: `remainder f(${k})`, latex: `\\text{Remainder of } \\dfrac{x^2${this.signTerm(b, 'x')}${this.signTerm(a)}}{x ${k < 0 ? '+' : '-'} ${Math.abs(k)}}`, hint: '= \\;?', answer: k * k + b * k + a, type: 'remainder' }; }
            case 4: return this.seqArithmetic();
            case 5: return this.seqGeometric();
        }
    }

    seqArithmetic() {
        const a0 = this.ri(1, 9), d = this.ri(2, 6), n = this.ri(4, 6);
        const terms = []; let sum = 0;
        for (let i = 0; i < n; i++) { terms.push(a0 + i * d); sum += a0 + i * d; }
        return { question: terms.join('+'), latex: terms.join(' + '), hint: '= \\;?', answer: sum, type: 'arith-series' };
    }

    seqGeometric() {
        const a0 = this.ri(1, 4), r = this.ri(2, 3), n = this.ri(3, 4);
        const terms = []; let sum = 0;
        for (let i = 0; i < n; i++) { terms.push(a0 * Math.pow(r, i)); sum += a0 * Math.pow(r, i); }
        return { question: terms.join('+'), latex: terms.join(' + '), hint: '= \\;?', answer: sum, type: 'geo-series' };
    }

    // ====================================================================
    // 8 · PRECALCULUS — Series, Binomials, Matrices, Limits, Unit Circle
    // ====================================================================
    genPrecalc() {
        switch (this.ri(0, 5)) {
            case 0: { const n = this.ri(4, 8), k = this.ri(1, n - 1); return { question: `C(${n},${k})`, latex: `\\binom{${n}}{${k}}`, hint: '= \\;?', answer: this.choose(n, k), type: 'binomial' }; }
            case 1: return this.pComposition();
            case 2: { const a = this.ri(-5, 6), b = this.ri(-5, 6), c = this.ri(-5, 6), d = this.ri(-5, 6); return { question: `det`, latex: `\\begin{vmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{vmatrix}`, hint: '= \\;?', answer: a * d - b * c, type: 'determinant' }; }
            case 3: { const a = this.ri(2, 8); return { question: `lim x->${a}`, latex: `\\lim_{x \\to ${a}} \\dfrac{x^2 - ${a * a}}{x - ${a}}`, hint: '= \\;?', answer: 2 * a, type: 'limit' }; }
            case 4: return this.unitCircle();
            case 5: { const [p, q, r] = this.triple(); return { question: `|<${p},${q}>|`, latex: `\\lVert \\langle ${p}, ${q} \\rangle \\rVert`, hint: '= \\;?', answer: r, type: 'vector-mag' }; }
        }
    }

    unitCircle() {
        const opts = [
            ['\\sin', 0, 0], ['\\sin', 90, 1], ['\\sin', 180, 0], ['\\sin', 270, -1],
            ['\\cos', 0, 1], ['\\cos', 90, 0], ['\\cos', 180, -1], ['\\cos', 270, 0],
        ];
        const [fn, deg, val] = this.pick(opts);
        return { question: `${fn}${deg}`, latex: `${fn} ${deg}^{\\circ}`, hint: '= \\;?', answer: val, type: 'unit-circle' };
    }

    // Function composition f(g(k)) — a precalculus topic.
    pComposition() {
        const a = this.ri(2, 4), b = this.ri(-5, 5), c = this.ri(2, 4), d = this.ri(-5, 5), k = this.ri(-3, 4);
        return { question: `f(g(${k}))`, latex: `f(x) = ${this.leadTerm(a, 'x')}${this.signTerm(b)}, \\quad g(x) = ${this.leadTerm(c, 'x')}${this.signTerm(d)}`, hint: `f(g(${k})) = \\;?`, answer: a * (c * k + d) + b, type: 'composition' };
    }

    // ====================================================================
    // 9 · CALCULUS / STATISTICS — Derivatives, Integrals, Limits, Data
    // ====================================================================
    genCalculus() {
        switch (this.ri(0, 4)) {
            case 0: { const a = this.ri(1, 5), b = this.ri(-6, 6), c = this.ri(-6, 6), k = this.ri(-3, 4); return { question: `f'(${k})`, latex: `\\dfrac{d}{dx}\\left(${this.leadTerm(a, 'x^2')}${this.signTerm(b, 'x')}${this.signTerm(c)}\\right)`, hint: `\\text{at } x = ${k}`, answer: 2 * a * k + b, type: 'derivative' }; }
            case 1: { const a = this.ri(1, 3) * 2, b = this.ri(-4, 5), q = this.ri(2, 5); return { question: `int 0..${q}`, latex: `\\int_{0}^{${q}} (${this.leadTerm(a, 'x')}${this.signTerm(b)}) \\, dx`, hint: '= \\;?', answer: a * q * q / 2 + b * q, type: 'integral' }; }
            case 2: return this.statMean();
            case 3: return this.statMedian();
            case 4: return this.statProbability();
        }
    }

    statMean() {
        const n = this.ri(4, 5), mean = this.ri(4, 20);
        const data = []; let sum = 0;
        for (let i = 0; i < n - 1; i++) { const v = this.ri(1, 30); data.push(v); sum += v; }
        data.push(mean * n - sum); // force the mean to be an integer
        if (data[n - 1] < 0 || data[n - 1] > 40) return this.statMean();
        return { question: `mean ${data.join(',')}`, latex: `\\text{Mean of } \\{${data.join(', ')}\\}`, hint: '= \\;?', answer: mean, type: 'mean' };
    }

    statMedian() {
        const n = this.pick([5, 7]);
        const data = []; for (let i = 0; i < n; i++) data.push(this.ri(1, 50));
        const sorted = [...data].sort((p, q) => p - q);
        return { question: `median ${data.join(',')}`, latex: `\\text{Median of } \\{${data.join(', ')}\\}`, hint: '= \\;?', answer: sorted[(n - 1) / 2], type: 'median' };
    }

    statProbability() {
        const total = this.ri(4, 12), fav = this.ri(1, total - 1);
        return { question: `P=${fav}/${total}`, latex: `${fav} \\text{ favorable out of } ${total}`, hint: 'P = \\;?', answer: fav / total, answerText: this.fracText(fav, total), type: 'probability' };
    }

    // ---- Atoms reused across several levels -----------------------------
    // Signed-integer arithmetic — answers may be negative.
    atomSigned() {
        const kind = this.ri(0, 3);
        let a, b, answer, latex;
        if (kind === 0) { a = this.riNZ(-30, 30); b = this.riNZ(-30, 30); answer = a + b; latex = `${a} ${this.op('+')} ${this.paren(b)}`; }
        else if (kind === 1) { a = this.riNZ(-30, 30); b = this.riNZ(-30, 30); answer = a - b; latex = `${a} ${this.op('−')} ${this.paren(b)}`; }
        else if (kind === 2) { a = this.riNZ(-12, 12); b = this.riNZ(-12, 12); answer = a * b; latex = `${this.paren(a)} ${this.op('×')} ${this.paren(b)}`; }
        else { const d = this.riNZ(2, 12) * (Math.random() < 0.5 ? 1 : -1), q = this.riNZ(-12, 12); answer = q; latex = `${d * q} ${this.op('÷')} ${this.paren(d)}`; }
        return { question: latex, latex, answer, type: 'signed' };
    }

    // Solve a one-/two-step linear equation for x.
    atomLinearEq() {
        const t = this.ri(0, 2);
        let answer, latex;
        if (t === 0) { const a = this.ri(2, 9), x = this.ri(-9, 12), b = this.ri(-12, 20); answer = x; latex = `${a}x${this.signTerm(b)} = ${a * x + b}`; }
        else if (t === 1) { const a = this.ri(2, 9), b = this.ri(-9, 12); answer = a * b; latex = `\\dfrac{x}{${a}} = ${b}`; }
        else { const a = this.ri(2, 12), x = this.ri(-9, 12); answer = x; latex = `${a}x = ${a * x}`; }
        return { question: latex, latex, hint: 'x = \\;?', answer, type: 'equation' };
    }

    // Evaluate a power.
    atomExponent() {
        const t = this.ri(0, 2);
        let base, exp;
        if (t === 0) { base = this.ri(2, 12); exp = 2; }
        else if (t === 1) { base = this.ri(2, 6); exp = 3; }
        else { base = 2; exp = this.ri(4, 7); }
        return { question: `${base}^${exp}`, latex: `${base}^{${exp}}`, answer: Math.pow(base, exp), type: 'exponent' };
    }

    // Square root of a perfect square.
    atomRoot() {
        const r = this.ri(2, 20);
        return { question: `sqrt(${r * r})`, latex: `\\sqrt{${r * r}}`, answer: r, type: 'root' };
    }

    // Initialize UI
    init() {
        this.updateModeUI();
        this.renderQuestion();
        this.updateStats();
        this.renderRecordList();
    }

    // Reflect the active level in the tab bar.
    // Tabs are colored dots; the active one grows into a pill showing its name.
    updateModeUI() {
        document.querySelectorAll('.mode-tab').forEach(tab => {
            const c = MODE_CONFIG[tab.dataset.mode];
            const label = `${c.name} · ${c.grade}`;
            tab.style.background = c.color;
            tab.title = label;
            const active = tab.dataset.mode === this.mode;
            tab.classList.toggle('active', active);
            tab.textContent = active ? label : '';
        });
        // Every level uses the same full keypad (± . / always available).
    }

    // Typeset a LaTeX string into a target element via KaTeX, with a graceful
    // plain-text fallback if the library hasn't loaded.
    typeset(target, latex) {
        if (window.katex) {
            window.katex.render(latex, target, { throwOnError: false, displayMode: true });
        } else {
            target.textContent = latex
                .replace(/\\dfrac\{([^}]*)\}\{([^}]*)\}/g, '$1/$2')
                .replace(/\\sqrt\{([^}]*)\}/g, '√$1')
                .replace(/\^\{([^}]*)\}/g, '^$1')
                .replace(/\\times/g, '×').replace(/\\div/g, '÷')
                .replace(/\\%/g, '%').replace(/\\text\{([^}]*)\}/g, '$1')
                .replace(/[\\{}]/g, '').replace(/\s+/g, ' ').trim();
        }
    }

    // Render the current question (expression + optional hint line).
    renderMath(question) {
        const el = document.getElementById('questionText');
        el.innerHTML = '';
        const stack = document.createElement('div');
        stack.className = 'q-stack';

        const main = document.createElement('div');
        this.typeset(main, question.latex);
        stack.appendChild(main);

        if (question.hint) {
            const hint = document.createElement('div');
            hint.className = 'ms-hint';
            this.typeset(hint, question.hint);
            stack.appendChild(hint);
        }
        el.appendChild(stack);
    }

    // Render current question
    renderQuestion() {
        const question = this.questions[this.currentIndex];
        document.getElementById('questionNum').textContent = this.currentIndex + 1;
        this.renderMath(question);
        const stored = this.answers[this.currentIndex];
        document.getElementById('answerInput').value = stored === null ? '' : stored;
        document.getElementById('feedback').className = 'feedback';
        document.getElementById('feedback').textContent = '';

        // Update submit button
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = this.answers[this.currentIndex] !== null;

        // Update navigation buttons
        document.getElementById('prevBtn').disabled = this.currentIndex === 0;
        document.getElementById('nextBtn').disabled = this.currentIndex === QUESTION_COUNT - 1;

        // If already answered, lock input and hide the number pad
        const numpad = document.getElementById('numpad');
        if (this.answers[this.currentIndex] !== null) {
            document.getElementById('answerInput').disabled = true;
            submitBtn.style.display = 'none';
            numpad.classList.add('hidden');
            this.showFeedback();
        } else {
            document.getElementById('answerInput').disabled = false;
            submitBtn.style.display = 'block';
            numpad.classList.remove('hidden');
        }

        // Update sidebar active state
        const recordItems = document.querySelectorAll('.record-item');
        recordItems.forEach((item, idx) => {
            item.classList.toggle('active', idx === this.currentIndex);
        });
    }

    // ---- Number-pad input handlers (no system keyboard) ----------------
    // The current "number segment" is the part after the last "/" (and any
    // leading "-"), used to decide whether a "." is still allowed.
    currentSegment(value) {
        return value.split('/').pop().replace('-', '');
    }

    pressDigit(d) {
        if (this.answers[this.currentIndex] !== null) return;
        const input = document.getElementById('answerInput');
        if (input.value.length < 12) input.value += d;
    }

    pressBackspace() {
        if (this.answers[this.currentIndex] !== null) return;
        const input = document.getElementById('answerInput');
        input.value = input.value.slice(0, -1);
    }

    pressClear() {
        if (this.answers[this.currentIndex] !== null) return;
        document.getElementById('answerInput').value = '';
    }

    // Toggle a leading minus sign (answers may be negative).
    pressNegate() {
        if (this.answers[this.currentIndex] !== null) return;
        const input = document.getElementById('answerInput');
        input.value = input.value.startsWith('-') ? input.value.slice(1) : '-' + input.value;
    }

    // Decimal point — at most one per number segment.
    pressDot() {
        if (this.answers[this.currentIndex] !== null) return;
        const input = document.getElementById('answerInput');
        if (input.value.length >= 12) return;
        if (this.currentSegment(input.value).includes('.')) return;
        // Start "0." when the segment is empty so the value parses cleanly.
        input.value += this.currentSegment(input.value) === '' ? '0.' : '.';
    }

    // Fraction bar — a single "/", not leading/trailing.
    pressFraction() {
        if (this.answers[this.currentIndex] !== null) return;
        const input = document.getElementById('answerInput');
        const v = input.value;
        if (v.length >= 12 || v.includes('/')) return;
        if (v === '' || v === '-' || v.endsWith('.')) return;
        input.value += '/';
    }

    // Parse a typed answer ("-3/4", "2.5", "7") into a numeric value, or NaN.
    parseValue(str) {
        str = str.trim();
        if (str === '' || str === '-') return NaN;
        if (str.includes('/')) {
            const [num, den] = str.split('/');
            const n = parseFloat(num), d = parseFloat(den);
            if (!d || Number.isNaN(n)) return NaN;
            return n / d;
        }
        return parseFloat(str);
    }

    // Submit answer
    submitAnswer() {
        const raw = document.getElementById('answerInput').value.trim();
        const value = this.parseValue(raw);
        if (Number.isNaN(value)) {
            alert('Please enter a valid answer');
            return;
        }

        const correctAnswer = this.questions[this.currentIndex].answer;

        this.answers[this.currentIndex] = raw; // keep the typed form for replay
        this.correct[this.currentIndex] = Math.abs(value - correctAnswer) < EPS;

        this.renderQuestion();
        this.updateStats();
        this.renderRecordList();
        this.saveProgress();

        // Check if all questions are answered
        if (this.answers.every(a => a !== null)) {
            this.showCompletion();
        }
    }

    // Human-readable correct answer (fractions keep their "p/q" form).
    answerLabel(question) {
        return question.answerText !== undefined ? question.answerText : question.answer;
    }

    // Show feedback
    showFeedback() {
        const feedbackEl = document.getElementById('feedback');
        const isCorrect = this.correct[this.currentIndex];
        const question = this.questions[this.currentIndex];

        if (isCorrect) {
            feedbackEl.textContent = `✓ Correct! Answer: ${this.answerLabel(question)}`;
            feedbackEl.className = 'feedback show correct';
        } else {
            const userAnswer = this.answers[this.currentIndex];
            feedbackEl.textContent = `✗ Incorrect! Your answer: ${userAnswer}, Correct answer: ${this.answerLabel(question)}`;
            feedbackEl.className = 'feedback show incorrect';
        }
    }

    // Update statistics
    updateStats() {
        const score = this.correct.filter(c => c).length;
        const answered = this.answers.filter(a => a !== null).length;

        document.getElementById('score').textContent = score;

        // Update progress bar
        const progress = (answered / QUESTION_COUNT) * 100;
        document.getElementById('progressBar').style.width = progress + '%';
    }

    // Render record list
    renderRecordList() {
        const recordList = document.getElementById('recordList');
        recordList.innerHTML = '';

        for (let i = 0; i < QUESTION_COUNT; i++) {
            const item = document.createElement('div');
            item.className = 'record-item';
            item.textContent = i + 1;

            // green = correct, red = wrong, grey = not answered yet
            if (this.answers[i] === null) {
                item.classList.add('pending');
            } else if (this.correct[i]) {
                item.classList.add('correct');
            } else {
                item.classList.add('incorrect');
            }

            if (i === this.currentIndex) {
                item.classList.add('active');
            }

            item.addEventListener('click', () => {
                this.currentIndex = i;
                this.renderQuestion();
                this.updateStats();
                this.renderRecordList();
                this.saveProgress();
                item.scrollIntoView({ block: 'nearest' });
            });

            recordList.appendChild(item);
        }
    }

    // Previous question
    previousQuestion() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.renderQuestion();
            this.updateStats();
            this.renderRecordList();
            this.saveProgress();
        }
    }

    // Next question
    nextQuestion() {
        if (this.currentIndex < QUESTION_COUNT - 1) {
            this.currentIndex++;
            this.renderQuestion();
            this.updateStats();
            this.renderRecordList();
            this.saveProgress();
        }
    }

    // Show completion
    showCompletion() {
        const score = this.correct.filter(c => c).length;
        const accuracy = Math.round(score / QUESTION_COUNT * 100);

        let grade = '';
        if (accuracy >= 90) grade = '🌟 Excellent';
        else if (accuracy >= 80) grade = '👍 Good';
        else if (accuracy >= 70) grade = '😊 Passed';
        else if (accuracy >= 60) grade = '😕 Needs Improvement';
        else grade = '💪 Keep Going';

        document.getElementById('finalScore').textContent = score;
        document.getElementById('finalAccuracy').textContent = accuracy + '%';
        document.getElementById('finalGrade').textContent = grade;

        document.getElementById('completionOverlay').style.display = 'flex';
    }

    // Restart — regenerate a brand-new set for the active level ONLY;
    // other levels' cached progress is untouched.
    restart() {
        this.sets[this.mode] = this.generateSet(this.mode);
        this.applyActiveSet();
        this.saveSet(this.mode);
        this.renderQuestion();
        this.updateStats();
        this.renderRecordList();
        document.getElementById('completionOverlay').style.display = 'none';
    }
}

// Initialize
let quiz;

window.addEventListener('load', () => {
    quiz = new MathQuiz();

    // Event listeners
    document.getElementById('submitBtn').addEventListener('click', () => {
        quiz.submitAnswer();
    });

    // Mode tabs — switch between Basic and Middle-School sets
    document.getElementById('modeTabs').addEventListener('click', (e) => {
        const tab = e.target.closest('.mode-tab');
        if (tab) quiz.setMode(tab.dataset.mode);
    });

    // On-screen number pad — delegate clicks
    document.getElementById('numpad').addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        if (btn.dataset.num !== undefined) quiz.pressDigit(btn.dataset.num);
        else if (btn.dataset.action === 'clear') quiz.pressClear();
        else if (btn.dataset.action === 'back') quiz.pressBackspace();
        else if (btn.dataset.action === 'neg') quiz.pressNegate();
        else if (btn.dataset.action === 'dot') quiz.pressDot();
        else if (btn.dataset.action === 'frac') quiz.pressFraction();
    });

    // Physical keyboard still works on desktop (input itself stays readonly)
    document.addEventListener('keydown', (e) => {
        if (document.getElementById('completionOverlay').style.display === 'flex') return;
        if (e.key >= '0' && e.key <= '9') quiz.pressDigit(e.key);
        else if (e.key === '-') quiz.pressNegate();
        else if (e.key === '.') quiz.pressDot();
        else if (e.key === '/') { e.preventDefault(); quiz.pressFraction(); }
        else if (e.key === 'Backspace') { e.preventDefault(); quiz.pressBackspace(); }
        else if (e.key === 'Enter' && !document.getElementById('submitBtn').disabled) quiz.submitAnswer();
    });

    document.getElementById('prevBtn').addEventListener('click', () => {
        quiz.previousQuestion();
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        quiz.nextQuestion();
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
        if (confirm(`Restart the "${quiz.modeLabel()}" questions only? Your other levels stay as they are.`)) {
            quiz.restart();
        }
    });

    document.getElementById('restartBtn').addEventListener('click', () => {
        quiz.restart();
    });
});
