class UIManager {
    constructor() {
        this.currentScreen = 'welcome';
        this.DOM = {};
        this.cacheElements();
    }

    cacheElements() {
        this.DOM = {
            // Screens
            welcomeScreen: document.getElementById('welcomeScreen'),
            quizScreen: document.getElementById('quizScreen'),
            resultsScreen: document.getElementById('resultsScreen'),
            leaderboardScreen: document.getElementById('leaderboardScreen'),
            
            // Welcome
            startQuizBtn: document.getElementById('startQuizBtn'),
            practiceMode: document.getElementById('practiceMode'),
            challengeMode: document.getElementById('challengeMode'),
            
            // Quiz
            questionText: document.getElementById('questionText'),
            answersGrid: document.getElementById('answersGrid'),
            currentQuestion: document.getElementById('currentQuestion'),
            totalQuestions: document.getElementById('totalQuestions'),
            currentScore: document.getElementById('currentScore'),
            categoryBadge: document.getElementById('categoryBadge'),
            streakDisplay: document.getElementById('streakDisplay'),
            streakCount: document.getElementById('streakCount'),
            progressFill: document.getElementById('progressFill'),
            timerText: document.getElementById('timerText'),
            timerProgress: document.getElementById('timerProgress'),
            timerSection: document.getElementById('timerSection'),
            feedbackSection: document.getElementById('feedbackSection'),
            feedbackContent: document.getElementById('feedbackContent'),
            nextBtn: document.getElementById('nextBtn'),
            prevBtn: document.getElementById('prevBtn'),
            skipBtn: document.getElementById('skipBtn'),
            
            // Results
            finalScore: document.getElementById('finalScore'),
            maxScore: document.getElementById('maxScore'),
            accuracyValue: document.getElementById('accuracyValue'),
            accuracyBar: document.getElementById('accuracyBar'),
            timeTakenValue: document.getElementById('timeTakenValue'),
            bestStreakValue: document.getElementById('bestStreakValue'),
            speedValue: document.getElementById('speedValue'),
            categoryStats: document.getElementById('categoryStats'),
            answerReview: document.getElementById('answerReview'),
            performanceMessage: document.getElementById('performanceMessage'),
            
            // Buttons
            leaderboardBtn: null,
            settingsBtn: document.getElementById('settingsBtn'),
            reviewAnswersBtn: document.getElementById('reviewAnswersBtn'),
            retryQuizBtn: document.getElementById('retryQuizBtn'),
            backToMenuBtn: document.getElementById('backToMenuBtn'),
            
            // Settings & Modals
            settingsModal: document.getElementById('settingsModal'),
            leaderboardScreen: document.getElementById('leaderboardScreen'),
            modalOverlay: document.getElementById('modalOverlay'),
            soundToggle: document.getElementById('soundToggle'),
            themeSelect: document.getElementById('themeSelect'),
            clearDataBtn: document.getElementById('clearDataBtn'),
            
            // Stats
            totalAttempts: document.getElementById('totalAttempts'),
            bestScore: document.getElementById('bestScore'),
            avgScore: document.getElementById('avgScore')
        };
    }

    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('screen-active');
        });
        
        // Show target screen
        const screenMap = {
            'welcome': this.DOM.welcomeScreen,
            'quiz': this.DOM.quizScreen,
            'results': this.DOM.resultsScreen
        };
        
        if (screenMap[screenName]) {
            screenMap[screenName].classList.add('screen-active');
            this.currentScreen = screenName;
        }
    }

    renderQuestion(question, index, total) {
        if (!question) return;

        this.DOM.questionText.textContent = question.question;
        this.DOM.currentQuestion.textContent = index;
        this.DOM.totalQuestions.textContent = total;
        this.DOM.categoryBadge.textContent = question.category;
        
        this.renderAnswers(question.options, question.correctAnswer);
        this.updateProgressBar(index, total);
    }

    renderAnswers(options, correctIndex) {
        this.DOM.answersGrid.innerHTML = '';
        
        options.forEach((option, index) => {
            const answerDiv = document.createElement('button');
            answerDiv.className = 'answer-option';
            answerDiv.innerHTML = `
                <span class="answer-letter">${String.fromCharCode(65 + index)}</span>
                <span class="answer-text">${option}</span>
            `;
            answerDiv.dataset.index = index;
            this.DOM.answersGrid.appendChild(answerDiv);
        });
    }

    updateProgressBar(current, total) {
        const percentage = (current / total) * 100;
        this.DOM.progressFill.style.width = percentage + '%';
    }

    updateScore(score) {
        this.DOM.currentScore.textContent = score;
    }

    updateStreak(streak) {
        if (streak > 0) {
            this.DOM.streakDisplay.style.display = 'inline';
            this.DOM.streakCount.textContent = streak;
        } else {
            this.DOM.streakDisplay.style.display = 'none';
        }
    }

    updateTimer(remaining, percentage, isWarning, isDanger) {
        this.DOM.timerText.textContent = remaining;
        
        // Update circle progress
        const circumference = 100; // 2 * π * r approximation
        const offset = circumference - (percentage / 100) * circumference;
        this.DOM.timerProgress.style.strokeDashoffset = offset;
        
        // Update classes for warning/danger
        this.DOM.timerProgress.classList.remove('warning', 'danger');
        if (isDanger) {
            this.DOM.timerProgress.classList.add('danger');
            this.DOM.timerText.classList.add('warning');
        } else if (isWarning) {
            this.DOM.timerProgress.classList.add('warning');
            this.DOM.timerText.classList.remove('warning');
        }
    }

    showFeedback(isCorrect, explanation, reference) {
        this.DOM.feedbackSection.style.display = 'block';
        const statusText = isCorrect ? '✅ Correct!' : '❌ Incorrect!';
        const borderColor = isCorrect ? '#00d084' : '#ff4444';
        
        this.DOM.feedbackContent.innerHTML = `
            <div class="feedback-title">${statusText}</div>
            <div class="feedback-explanation">${explanation}</div>
            <div class="feedback-reference">
                <strong>Learn more:</strong>
                <a href="${reference}" target="_blank" rel="noopener noreferrer">W3Schools React Reference →</a>
            </div>
        `;
        
        // Update section styling
        this.DOM.feedbackSection.classList.remove('incorrect');
        if (!isCorrect) {
            this.DOM.feedbackSection.classList.add('incorrect');
        }
    }

    hideFeedback() {
        this.DOM.feedbackSection.style.display = 'none';
        this.DOM.feedbackContent.innerHTML = '';
    }

    showResults(results) {
        this.DOM.finalScore.textContent = results.correct;
        this.DOM.maxScore.textContent = results.answered;
        this.DOM.accuracyValue.textContent = results.accuracy + '%';
        this.DOM.accuracyBar.style.width = results.accuracy + '%';
        this.DOM.timeTakenValue.textContent = results.totalTime + 's';
        this.DOM.bestStreakValue.textContent = results.highestStreak;
        this.DOM.speedValue.textContent = results.avgTimePerQuestion + 's/q';
        this.DOM.performanceMessage.textContent = results.performanceLevel.message;
        
        // Category breakdown
        this.renderCategoryStats(results.categoryStats);
        
        // Answer review
        this.renderAnswerReview(results.answers);
    }

    renderCategoryStats(categoryStats) {
        this.DOM.categoryStats.innerHTML = '';
        
        Object.entries(categoryStats).forEach(([category, stats]) => {
            const percentage = ((stats.correct / stats.total) * 100).toFixed(0);
            const div = document.createElement('div');
            div.className = 'category-stat';
            div.innerHTML = `
                <div class="category-name">${category}</div>
                <div class="category-score">${stats.correct}/${stats.total}</div>
                <div style="font-size: 0.85rem; color: var(--text-muted);">${percentage}%</div>
            `;
            this.DOM.categoryStats.appendChild(div);
        });
    }

    renderAnswerReview(answers) {
        this.DOM.answerReview.innerHTML = '<h3>Answer Review</h3>';
        
        answers.slice(0, 5).forEach(answer => {
            const className = answer.isCorrect ? 'correct' : 'incorrect';
            const icon = answer.isCorrect ? '✅' : '❌';
            const div = document.createElement('div');
            div.className = `answer-item ${className}`;
            div.innerHTML = `
                <div class="answer-item-question">${icon} Q: ${answer.question}</div>
                <div class="answer-item-result">Your answer: ${answer.selectedAnswer}</div>
            `;
            this.DOM.answerReview.appendChild(div);
        });
        
        if (answers.length > 5) {
            const moreDiv = document.createElement('div');
            moreDiv.style.textAlign = 'center';
            moreDiv.innerHTML = `<p>+ ${answers.length - 5} more questions</p>`;
            this.DOM.answerReview.appendChild(moreDiv);
        }
    }

    showSettings() {
        this.DOM.settingsModal.classList.add('active');
        this.DOM.modalOverlay.style.display = 'block';
    }

    hideSettings() {
        this.DOM.settingsModal.classList.remove('active');
        this.DOM.modalOverlay.style.display = 'none';
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const iconMap = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
        toast.innerHTML = `
            <span class="toast-icon">${iconMap[type]}</span>
            <span class="toast-message">${message}</span>
        `;
        
        document.getElementById('toastContainer').appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    setWelcomeStats(stats) {
        if (!stats) return;
        this.DOM.totalAttempts.textContent = stats.totalAttempts || 0;
        const best = stats.bestAccuracy !== undefined ? stats.bestAccuracy : (stats.bestScore ? (stats.bestScore * 10) : 0);
        const avg = stats.avgAccuracy !== undefined ? stats.avgAccuracy : 0;
        this.DOM.bestScore.textContent = (isFinite(best) && best > 0) ? Math.min(100, Math.round(best)) + '%' : '0%';
        this.DOM.avgScore.textContent = (isFinite(avg) && avg > 0) ? Math.min(100, Math.round(avg)) + '%' : '0%';
    }

    disableAnswers() {
        document.querySelectorAll('.answer-option').forEach(btn => {
            btn.classList.add('disabled');
            btn.style.pointerEvents = 'none';
        });
    }

    enableAnswers() {
        document.querySelectorAll('.answer-option').forEach(btn => {
            btn.classList.remove('disabled');
            btn.style.pointerEvents = 'auto';
        });
    }

    highlightAnswer(index, isCorrect) {
        const options = document.querySelectorAll('.answer-option');
        if (options[index]) {
            options[index].classList.add(isCorrect ? 'correct' : 'incorrect');
        }
    }

    selectAnswer(index) {
        document.querySelectorAll('.answer-option').forEach((btn, i) => {
            btn.classList.remove('selected');
            if (i === index) btn.classList.add('selected');
        });
    }

    updateWelcomeStats(stats) {
        if (stats) {
            this.DOM.totalAttempts.textContent = stats.totalAttempts || 0;
            const best = stats.bestAccuracy !== undefined ? stats.bestAccuracy : 0;
            const avg = stats.avgAccuracy !== undefined ? stats.avgAccuracy : 0;
            this.DOM.bestScore.textContent = (isFinite(best) && best > 0) ? Math.min(100, Math.round(best)) + '%' : '0%';
            this.DOM.avgScore.textContent = (isFinite(avg) && avg > 0) ? Math.min(100, Math.round(avg)) + '%' : '0%';
        }
    }
}

const ui = new UIManager();
