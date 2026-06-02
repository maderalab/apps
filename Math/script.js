// Math Quiz - Question Generation and State Management
const QUESTION_COUNT = 100;

class MathQuiz {
    constructor() {
        this.questions = [];
        this.currentIndex = 0;
        this.answers = new Array(QUESTION_COUNT).fill(null);
        this.correct = new Array(QUESTION_COUNT).fill(false);
        this.generateQuestions();
        this.init();
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

        // If already answered, disable input
        if (this.answers[this.currentIndex] !== null) {
            document.getElementById('answerInput').disabled = true;
            submitBtn.style.display = 'none';
            this.showFeedback();
        } else {
            document.getElementById('answerInput').disabled = false;
            submitBtn.style.display = 'block';
        }

        // Update sidebar active state
        const recordItems = document.querySelectorAll('.record-item');
        recordItems.forEach((item, idx) => {
            item.classList.toggle('active', idx === this.currentIndex);
        });

        // Focus input field
        document.getElementById('answerInput').focus();
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
        const accuracy = answered === 0 ? 0 : Math.round(score / answered * 100);

        document.getElementById('currentQuestion').textContent = this.currentIndex + 1;
        document.getElementById('score').textContent = score;
        document.getElementById('accuracy').textContent = accuracy + '%';

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
        }
    }

    // Next question
    nextQuestion() {
        if (this.currentIndex < QUESTION_COUNT - 1) {
            this.currentIndex++;
            this.renderQuestion();
            this.updateStats();
            this.renderRecordList();
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

    // Restart
    restart() {
        this.questions = [];
        this.currentIndex = 0;
        this.answers = new Array(QUESTION_COUNT).fill(null);
        this.correct = new Array(QUESTION_COUNT).fill(false);
        this.generateQuestions();
        this.renderQuestion();
        this.updateStats();
        this.renderRecordList();
        document.getElementById('completionOverlay').style.display = 'none';
    }
}

// Handwriting scratchpad — draw your working out with mouse / touch / stylus
function setupScratchpad() {
    const canvas = document.getElementById('scratchCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let mode = 'pen';
    let drawing = false;
    let last = null;

    // Size the backing store to the displayed size (handles high-DPI), keeping
    // whatever is already drawn.
    function fitCanvas() {
        const rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const dpr = window.devicePixelRatio || 1;
        const prevW = canvas.width, prevH = canvas.height;
        let snapshot = null;
        if (prevW && prevH) {
            snapshot = document.createElement('canvas');
            snapshot.width = prevW; snapshot.height = prevH;
            snapshot.getContext('2d').drawImage(canvas, 0, 0);
        }
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        if (snapshot) ctx.drawImage(snapshot, 0, 0, rect.width, rect.height);
    }

    function posOf(e) {
        const rect = canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function stroke(a, b) {
        ctx.globalCompositeOperation = mode === 'eraser' ? 'destination-out' : 'source-over';
        ctx.strokeStyle = '#1a2b4a';
        ctx.lineWidth = mode === 'eraser' ? 22 : 2.6;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
    }

    canvas.addEventListener('pointerdown', (e) => {
        drawing = true;
        canvas.setPointerCapture(e.pointerId);
        last = posOf(e);
        stroke(last, last); // a tap leaves a dot
    });
    canvas.addEventListener('pointermove', (e) => {
        if (!drawing) return;
        const p = posOf(e);
        stroke(last, p);
        last = p;
    });
    const stop = () => { drawing = false; };
    canvas.addEventListener('pointerup', stop);
    canvas.addEventListener('pointercancel', stop);
    canvas.addEventListener('pointerleave', stop);

    function clearCanvas() {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    }

    const penBtn = document.getElementById('penBtn');
    const eraserBtn = document.getElementById('eraserBtn');
    function setMode(m) {
        mode = m;
        penBtn.classList.toggle('active', m === 'pen');
        eraserBtn.classList.toggle('active', m === 'eraser');
    }
    penBtn.addEventListener('click', () => setMode('pen'));
    eraserBtn.addEventListener('click', () => setMode('eraser'));
    document.getElementById('clearCanvasBtn').addEventListener('click', clearCanvas);

    window.addEventListener('resize', fitCanvas);
    fitCanvas();
}

// Initialize
let quiz;

window.addEventListener('load', () => {
    quiz = new MathQuiz();
    setupScratchpad();

    // Event listeners
    document.getElementById('submitBtn').addEventListener('click', () => {
        quiz.submitAnswer();
    });

    document.getElementById('answerInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !document.getElementById('submitBtn').disabled) {
            quiz.submitAnswer();
        }
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

    document.getElementById('restartBtn').addEventListener('click', () => {
        quiz.restart();
    });
});
