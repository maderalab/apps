// Math Quiz - Question Generation and State Management
const QUESTION_COUNT = 100;
const STORAGE_KEY = 'mathQuizProgress';

class MathQuiz {
    constructor() {
        this.currentIndex = 0;
        // Resume today's saved progress; otherwise start a fresh daily set.
        if (!this.loadProgress()) {
            this.questions = [];
            this.answers = new Array(QUESTION_COUNT).fill(null);
            this.correct = new Array(QUESTION_COUNT).fill(false);
            this.generateQuestions();
            this.saveProgress();
        }
        this.init();
    }

    // Local date as YYYY-MM-DD — the cache key for "today"
    todayKey() {
        const d = new Date();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }

    // Restore progress if it belongs to today; returns true on success.
    loadProgress() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return false;
            const data = JSON.parse(raw);
            // A new day ⇒ discard and regenerate a brand-new question set.
            if (!data || data.date !== this.todayKey()) return false;
            if (!Array.isArray(data.questions) || data.questions.length !== QUESTION_COUNT) return false;
            this.questions = data.questions;
            this.answers = data.answers;
            this.correct = data.correct;
            this.currentIndex = data.currentIndex || 0;
            return true;
        } catch (e) {
            return false; // corrupted / unavailable storage → fresh start
        }
    }

    // Persist the full state so a reload resumes seamlessly.
    saveProgress() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                date: this.todayKey(),
                questions: this.questions,
                answers: this.answers,
                correct: this.correct,
                currentIndex: this.currentIndex
            }));
        } catch (e) { /* ignore quota / private-mode errors */ }
    }

    // Generate random questions
    generateQuestions() {
        this.questions = [];
        for (let i = 0; i < QUESTION_COUNT; i++) {
            const type = Math.floor(Math.random() * 3); // 0: addition/subtraction, 1: multiplication, 2: division
            this.questions.push(this.generateQuestion(type));
        }
    }

    // Generate a single question by type
    generateQuestion(type) {
        switch (type) {
            case 0:
                return this.generateAdditionSubtraction();
            case 1:
                return this.generateMultiplication();
            case 2:
                return this.generateDivision();
        }
    }

    // Generate addition/subtraction question (within 1000)
    generateAdditionSubtraction() {
        const operation = Math.random() > 0.5 ? '+' : '-';
        let a, b;

        if (operation === '+') {
            // Addition: both numbers within 1000, sum ≤ 1000
            a = Math.floor(Math.random() * 901) + 1; // 1-900
            b = Math.floor(Math.random() * (1000 - a)) + 1; // Ensure a+b ≤ 1000
        } else {
            // Subtraction: minuend > subtrahend
            a = Math.floor(Math.random() * 901) + 100; // 100-1000
            b = Math.floor(Math.random() * (a - 1)) + 1; // Avoid subtracting 0
        }

        const answer = operation === '+' ? a + b : a - b;
        return {
            question: `${a} ${operation} ${b}`,
            display: `${a} <span class="operator">${operation}</span> ${b}`,
            answer: answer,
            type: 'arithmetic'
        };
    }

    // Generate multiplication question (3-digit × single-digit)
    generateMultiplication() {
        const a = Math.floor(Math.random() * 900) + 1; // 1-999
        const b = Math.floor(Math.random() * 8) + 2;   // 2-9, avoid multiplying by 1
        const answer = a * b;
        return {
            question: `${a} × ${b}`,
            display: `${a} <span class="operator">×</span> ${b}`,
            answer: answer,
            type: 'multiplication'
        };
    }

    // Generate division question (3-digit ÷ single-digit, divisible)
    generateDivision() {
        const divisor = Math.floor(Math.random() * 8) + 2; // 2-9, avoid dividing by 1
        const quotient = Math.floor(Math.random() * 99) + 2; // 2-100, avoid quotient of 1
        const dividend = divisor * quotient; // Ensure divisible

        // Regenerate if exceeds 999
        if (dividend > 999) {
            return this.generateDivision();
        }

        return {
            question: `${dividend} ÷ ${divisor}`,
            display: `${dividend} <span class="operator">÷</span> ${divisor}`,
            answer: quotient,
            type: 'division'
        };
    }

    // Initialize UI
    init() {
        this.renderQuestion();
        this.updateStats();
        this.renderRecordList();
    }

    // Render current question
    renderQuestion() {
        const question = this.questions[this.currentIndex];
        document.getElementById('questionNum').textContent = this.currentIndex + 1;
        document.getElementById('questionText').innerHTML = question.display;
        document.getElementById('answerInput').value = this.answers[this.currentIndex] || '';
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

    // Number-pad input handlers (no system keyboard)
    pressDigit(d) {
        if (this.answers[this.currentIndex] !== null) return;
        const input = document.getElementById('answerInput');
        if (input.value.length < 7) input.value += d;
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

    // Submit answer
    submitAnswer() {
        const input = document.getElementById('answerInput').value.trim();
        if (!input) {
            alert('Please enter an answer');
            return;
        }

        const userAnswer = parseInt(input);
        const correctAnswer = this.questions[this.currentIndex].answer;

        this.answers[this.currentIndex] = userAnswer;
        this.correct[this.currentIndex] = userAnswer === correctAnswer;

        this.renderQuestion();
        this.updateStats();
        this.renderRecordList();
        this.saveProgress();

        // Check if all questions are answered
        if (this.answers.every(a => a !== null)) {
            this.showCompletion();
        }
    }

    // Show feedback
    showFeedback() {
        const feedbackEl = document.getElementById('feedback');
        const isCorrect = this.correct[this.currentIndex];
        const question = this.questions[this.currentIndex];

        if (isCorrect) {
            feedbackEl.textContent = `✓ Correct! Answer: ${question.answer}`;
            feedbackEl.className = 'feedback show correct';
        } else {
            const userAnswer = this.answers[this.currentIndex];
            feedbackEl.textContent = `✗ Incorrect! Your answer: ${userAnswer}, Correct answer: ${question.answer}`;
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

    // Build a clean worksheet from the current question set, then open print/PDF.
    printWorksheet() {
        this.renderPrintSheet();
        window.print();
    }

    renderPrintSheet() {
        const printSheet = document.getElementById('printSheet');
        const generatedOn = new Date().toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        printSheet.innerHTML = '';

        for (let pageIndex = 0; pageIndex < 2; pageIndex++) {
            const page = document.createElement('div');
            page.className = 'print-page';

            const header = document.createElement('div');
            header.className = 'print-header';
            header.innerHTML = `
                <div>
                    <h1>Math Practice Worksheet</h1>
                    <p>100 questions · Page ${pageIndex + 1} of 2 · Generated ${generatedOn}</p>
                </div>
                <div class="print-student-fields">
                    <span>Name:</span>
                    <span>Date:</span>
                    <span>Score:</span>
                </div>
            `;

            const grid = document.createElement('div');
            grid.className = 'print-question-grid';

            this.questions.slice(pageIndex * 50, pageIndex * 50 + 50).forEach((question, offset) => {
                const index = pageIndex * 50 + offset;
                const item = document.createElement('div');
                item.className = 'print-question';

                const number = document.createElement('span');
                number.className = 'print-question-number';
                number.textContent = `${index + 1}.`;

                const text = document.createElement('span');
                text.className = 'print-question-text';
                text.textContent = question.question;

                const line = document.createElement('span');
                line.className = 'print-answer-line';

                item.append(number, text, line);
                grid.appendChild(item);
            });

            page.append(header, grid);
            printSheet.appendChild(page);
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

    // Restart — manual force-refresh with a brand-new question set
    restart() {
        this.questions = [];
        this.currentIndex = 0;
        this.answers = new Array(QUESTION_COUNT).fill(null);
        this.correct = new Array(QUESTION_COUNT).fill(false);
        this.generateQuestions();
        this.saveProgress();
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

    // On-screen number pad — delegate clicks
    document.getElementById('numpad').addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        if (btn.dataset.num !== undefined) quiz.pressDigit(btn.dataset.num);
        else if (btn.dataset.action === 'clear') quiz.pressClear();
        else if (btn.dataset.action === 'back') quiz.pressBackspace();
    });

    // Physical keyboard still works on desktop (input itself stays readonly)
    document.addEventListener('keydown', (e) => {
        if (document.getElementById('completionOverlay').style.display === 'flex') return;
        if (e.key >= '0' && e.key <= '9') quiz.pressDigit(e.key);
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
        if (confirm('Are you sure you want to restart?')) {
            quiz.restart();
        }
    });

    document.getElementById('printBtn').addEventListener('click', () => {
        quiz.printWorksheet();
    });

    window.addEventListener('beforeprint', () => {
        quiz.renderPrintSheet();
    });

    document.getElementById('restartBtn').addEventListener('click', () => {
        quiz.restart();
    });
});
