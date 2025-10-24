/*
ReactMastery Quiz Application
W3Schools React Certification Exam Prep
*/

class QuizApp {
    constructor() {
        this.quizMode = 'practice';
        this.answerSelected = false;
        this.quizInProgress = false;
        this.questionStartTime = 0;
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.loadSettings();
        this.updateWelcomeStats();
    }

    attachEventListeners() {
        // Welcome Screen
        ui.DOM.startQuizBtn.addEventListener('click', () => this.startQuiz());
        ui.DOM.practiceMode.addEventListener('click', (e) => this.setMode(e.currentTarget));
        ui.DOM.challengeMode.addEventListener('click', (e) => this.setMode(e.currentTarget));

        // Logo navigates home
        const logo = document.querySelector('.logo-section');
        if (logo) {
            logo.style.cursor = 'pointer';
            logo.addEventListener('click', () => {
                this.backToMenu();
            });
        }

        // Quiz Navigation
        ui.DOM.nextBtn.addEventListener('click', () => this.nextQuestion());
        ui.DOM.prevBtn.addEventListener('click', () => this.previousQuestion());
        ui.DOM.skipBtn.addEventListener('click', () => this.skipQuestion());

        // Results Screen
        ui.DOM.retryQuizBtn.addEventListener('click', () => this.resetAndRestart());
        ui.DOM.backToMenuBtn.addEventListener('click', () => this.backToMenu());
        ui.DOM.reviewAnswersBtn.addEventListener('click', () => this.reviewAnswers());

        // Settings
        ui.DOM.settingsBtn.addEventListener('click', () => ui.showSettings());
        document.getElementById('closeSettings').addEventListener('click', () => ui.hideSettings());
        ui.DOM.modalOverlay.addEventListener('click', () => {
            ui.hideSettings();
        });

        ui.DOM.soundToggle.addEventListener('change', (e) => {
            storage.saveSettings({ soundEnabled: e.target.checked });
        });
        ui.DOM.themeSelect.addEventListener('change', (e) => {
            this.setTheme(e.target.value);
        });
        ui.DOM.clearDataBtn.addEventListener('click', () => this.clearAllData());
        document.getElementById('closeSettingsBtn').addEventListener('click', () => ui.hideSettings());

        // Answer options (delegated)
        document.addEventListener('click', (e) => {
            if (e.target.closest('.answer-option') && this.quizInProgress && !this.answerSelected) {
                this.selectAnswer(e.target.closest('.answer-option'));
            }
        });
    }

    setMode(btn) {
        this.quizMode = btn.dataset.mode;
        document.querySelectorAll('.mode-btn').forEach(b => {
            b.classList.remove('mode-active');
        });
        btn.classList.add('mode-active');
    }

    startQuiz() {
        // Initialize quiz engine
        quizEngine.initialize(this.quizMode, 'all', 'all');
        
        // Show quiz screen
        ui.showScreen('quiz');
        this.quizInProgress = true;
        
        // Show timer only in Challenge mode
        if (this.quizMode === 'challenge') {
            ui.DOM.timerSection.style.display = 'block';
        } else {
            ui.DOM.timerSection.style.display = 'none';
        }
        this.loadQuestion();

        // Start timer in Challenge mode
        if (this.quizMode === 'challenge') {
            this.startTimer(20);
        }
    }

    loadQuestion() {
        const question = quizEngine.getCurrentQuestion();
        const progress = quizEngine.getQuestionProgress();

        if (!question) {
            this.completeQuiz();
            return;
        }

        ui.hideFeedback();
        ui.renderQuestion(question, progress.current, progress.total);
        ui.updateScore(quizEngine.score);
        ui.updateStreak(quizEngine.streak);
        
        // Ensure timer visibility matches mode per question load
        ui.DOM.timerSection.style.display = this.quizMode === 'challenge' ? 'block' : 'none';

        // In challenge mode, restart timer for every question
        if (this.quizMode === 'challenge') {
            const existing = getTimer();
            if (existing) existing.stop();
            this.startTimer(20);
        }
        
        this.answerSelected = false;
        ui.enableAnswers();
        this.questionStartTime = Date.now();
        
        // Update button visibility
        this.updateNavButtons();
    }

    selectAnswer(btn) {
        this.answerSelected = true;
        ui.disableAnswers();

        const index = parseInt(btn.dataset.index);
        const question = quizEngine.getCurrentQuestion();
        const timeTaken = Math.floor((Date.now() - this.questionStartTime) / 1000);

        // Stop any running timer on selection
        const runningTimer = getTimer();
        if (runningTimer) runningTimer.stop();

        // Submit answer
        const answer = quizEngine.submitAnswer(index, timeTaken);

        // Show visual feedback
        ui.selectAnswer(index);
        ui.highlightAnswer(index, answer.isCorrect);
        
        // Show explanation (only if available)
        if (storage.getSettings().feedbackEnabled && question.explanation && question.reference) {
            ui.showFeedback(answer.isCorrect, question.explanation, question.reference);
        }

        ui.updateScore(quizEngine.score);
        ui.updateStreak(quizEngine.streak);

        // Do not end quiz on wrong answer; continue to next/allow navigation

        // Show next button
        ui.DOM.nextBtn.style.display = 'inline-block';
    }

    nextQuestion() {
        if (quizEngine.nextQuestion()) {
            this.loadQuestion();
        } else {
            this.completeQuiz();
        }
    }

    previousQuestion() {
        if (quizEngine.previousQuestion()) {
            this.loadQuestion();
        }
    }

    skipQuestion() {
        this.nextQuestion();
    }

    startTimer(duration) {
        const timer = createTimer(duration);
        timer.start({
            onTick: (timeData) => {
                ui.updateTimer(timeData.remaining, timeData.percentage, timeData.isWarning, timeData.isDanger);
            },
            onComplete: () => {
                // On timeout in challenge mode, move to next question (count as incorrect)
                if (this.quizInProgress && this.quizMode === 'challenge') {
                    const firstAnswer = document.querySelector('.answer-option');
                    if (firstAnswer) {
                        this.selectAnswer(firstAnswer); // select first option to register an answer
                        setTimeout(() => this.nextQuestion(), 300);
                    }
                }
            },
            onWarning: () => {
                ui.showToast('Time is running out!', 'warning');
            },
            warningThreshold: 5
        });
    }

    autoSubmitAnswer() {
        if (!this.answerSelected && this.quizInProgress) {
            const firstAnswer = document.querySelector('.answer-option');
            if (firstAnswer) {
                this.selectAnswer(firstAnswer);
                setTimeout(() => this.nextQuestion(), 1500);
            }
        }
    }

    completeQuiz() {
        this.quizInProgress = false;
        const timer = getTimer();
        if (timer) timer.stop();

        const results = quizEngine.completeQuiz();
        
        // Save attempt
        storage.saveQuizAttempt({
            mode: this.quizMode,
            score: results.correct,
            maxScore: results.answered,
            accuracy: results.accuracy,
            duration: results.totalTime,
            answers: results.answers
        });

        // Show results
        ui.showScreen('results');
        ui.showResults(results);
        ui.showToast('Quiz completed! Great job! 🎉', 'success');
    }

    resetAndRestart() {
        ui.showScreen('welcome');
        this.quizInProgress = false;
    }

    backToMenu() {
        ui.showScreen('welcome');
        this.quizInProgress = false;
        this.updateWelcomeStats();
    }

    reviewAnswers() {
        const results = quizEngine.getResults();
        console.log('Answer Review:', results.answers);
        ui.showToast('Review your answers above', 'info');
    }

    updateWelcomeStats() {
        const stats = storage.getQuizAttemptStats();
        if (stats) {
            ui.setWelcomeStats({
                totalAttempts: stats.totalAttempts,
                bestAccuracy: stats.bestAccuracy,
                avgAccuracy: stats.avgAccuracy
            });
        }
    }

    loadSettings() {
        const settings = storage.getSettings();
        ui.DOM.soundToggle.checked = settings.soundEnabled;
        ui.DOM.themeSelect.value = settings.theme;
        if (settings.theme === 'light') {
            document.body.classList.add('light-mode');
        }
    }

    setTheme(theme) {
        storage.saveSettings({ theme });
        if (theme === 'light') {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            storage.clearAllData();
            ui.showToast('All data cleared', 'success');
            this.resetAndRestart();
        }
    }

    updateNavButtons() {
        const progress = quizEngine.getQuestionProgress();
        
        // Previous button
        ui.DOM.prevBtn.style.display = progress.current > 1 ? 'inline-block' : 'none';
        
        // Skip button
        ui.DOM.skipBtn.style.display = this.quizMode === 'practice' ? 'inline-block' : 'none';
        
        // Next button
        ui.DOM.nextBtn.style.display = this.answerSelected && progress.current < progress.total ? 'inline-block' : 'none';
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new QuizApp();
    console.log('⚛️ ReactMastery Quiz App initialized');
});
