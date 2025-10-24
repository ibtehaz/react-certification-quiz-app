class QuizEngine {
    constructor() {
        this.questions = [];
        this.currentIndex = 0;
        this.answers = [];
        this.score = 0;
        this.mode = 'practice';
        this.startTime = null;
        this.endTime = null;
        this.streak = 0;
        this.highestStreak = 0;
        this.categoryStats = {};
    }

    initialize(mode = 'practice', difficulty = 'all', category = 'all') {
        this.mode = mode;
        this.currentIndex = 0;
        this.answers = [];
        this.score = 0;
        this.streak = 0;
        this.highestStreak = 0;
        this.categoryStats = {};
        this.startTime = Date.now();

        // Filter questions (support both legacy and V2 datasets)
        let filtered = (typeof REACT_QUESTIONS_V2 !== 'undefined')
            ? REACT_QUESTIONS_V2
            : (typeof REACT_QUESTIONS !== 'undefined' ? REACT_QUESTIONS : []);
        
        if (difficulty !== 'all') {
            filtered = filtered.filter(q => q.difficulty === difficulty);
        }
        
        if (category !== 'all') {
            filtered = filtered.filter(q => q.category.toLowerCase().includes(category.toLowerCase()));
        }

        // Keep original question order; include ALL available questions
        const orderedQuestions = filtered;

        // Now, for each selected question, shuffle its answers
        this.questions = orderedQuestions.map(q => {
            const originalCorrectAnswer = q.options[q.correctAnswer];
            const shuffledOptions = this.shuffleArray([...q.options]);
            const newCorrectIndex = shuffledOptions.findIndex(opt => opt === originalCorrectAnswer);
            
            return {
                ...q,
                options: shuffledOptions,
                correctAnswer: newCorrectIndex
            };
        });

        return this.questions;
    }

    getCurrentQuestion() {
        return this.questions[this.currentIndex] || null;
    }

    getQuestionProgress() {
        return {
            current: this.currentIndex + 1,
            total: this.questions.length
        };
    }

    submitAnswer(answerIndex, timeTaken = 0) {
        const question = this.getCurrentQuestion();
        if (!question) return null;

        const isCorrect = answerIndex === question.correctAnswer;
        
        const answer = {
            questionId: question.id,
            question: question.question,
            selectedAnswer: question.options[answerIndex],
            correctAnswer: question.options[question.correctAnswer],
            isCorrect,
            category: question.category,
            difficulty: question.difficulty,
            timeTaken
        };

        this.answers.push(answer);

        // Update score and streak
        if (isCorrect) {
            this.score += 10;
            this.streak++;
            if (this.streak > this.highestStreak) {
                this.highestStreak = this.streak;
            }
        } else {
            // Do not end quiz on wrong answer in challenge mode; just reset streak
            this.streak = 0;
        }

        // Update category stats
        if (!this.categoryStats[question.category]) {
            this.categoryStats[question.category] = { correct: 0, total: 0 };
        }
        this.categoryStats[question.category].total++;
        if (isCorrect) {
            this.categoryStats[question.category].correct++;
        }

        return answer;
    }

    nextQuestion() {
        if (this.currentIndex < this.questions.length - 1) {
            this.currentIndex++;
            return true;
        }
        return false;
    }

    previousQuestion() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            return true;
        }
        return false;
    }

    completeQuiz() {
        this.endTime = Date.now();
        return this.getResults();
    }

    getResults() {
        const totalTime = Math.floor((this.endTime - this.startTime) / 1000);
        const answered = this.answers.length;
        const correct = this.answers.filter(a => a.isCorrect).length;
        const accuracy = answered > 0 ? ((correct / answered) * 100).toFixed(1) : 0;

        return {
            score: this.score,
            maxScore: this.questions.length * 10,
            answered,
            correct,
            accuracy,
            totalTime,
            avgTimePerQuestion: (totalTime / answered).toFixed(1),
            highestStreak: this.highestStreak,
            mode: this.mode,
            answers: this.answers,
            categoryStats: this.categoryStats,
            performanceLevel: this.getPerformanceLevel(accuracy)
        };
    }

    getPerformanceLevel(accuracy) {
        accuracy = parseFloat(accuracy);
        if (accuracy >= 90) return { level: 'Excellent', emoji: '🌟', message: 'Excellent! You\'re a React expert!' };
        if (accuracy >= 75) return { level: 'Good', emoji: '⭐', message: 'Good work! Keep practicing!' };
        if (accuracy >= 60) return { level: 'Fair', emoji: '👍', message: 'Not bad! Review the basics!' };
        return { level: 'Needs Improvement', emoji: '📚', message: 'Keep learning! You\'ll get better!' };
    }

    getStats() {
        return {
            totalQuestions: this.questions.length,
            answeredQuestions: this.answers.length,
            correctAnswers: this.answers.filter(a => a.isCorrect).length,
            currentStreak: this.streak,
            highestStreak: this.highestStreak,
            score: this.score,
            categoryStats: this.categoryStats
        };
    }

    getCategoryBreakdown() {
        const breakdown = {};
        Object.entries(this.categoryStats).forEach(([category, stats]) => {
            breakdown[category] = {
                correct: stats.correct,
                total: stats.total,
                percentage: ((stats.correct / stats.total) * 100).toFixed(1)
            };
        });
        return breakdown;
    }

    canSubmit() {
        return this.currentIndex < this.questions.length;
    }

    isComplete() {
        return this.endTime !== null;
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// Create global instance
const quizEngine = new QuizEngine();
