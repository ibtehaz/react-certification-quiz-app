class StorageManager {
    constructor() {
        this.STORAGE_KEYS = {
            QUIZ_ATTEMPTS: 'quizAttempts',
            SETTINGS: 'settings',
            USER_STATS: 'userStats'
        };
    }


    // ===== Quiz Attempts Management =====
    saveQuizAttempt(attempt) {
        const attempts = this.getQuizAttempts();
        const newAttempt = {
            ...attempt,
            id: `attempt_${Date.now()}`,
            timestamp: new Date().toISOString(),
            duration: attempt.duration || 0
        };
        attempts.push(newAttempt);
        localStorage.setItem(this.STORAGE_KEYS.QUIZ_ATTEMPTS, JSON.stringify(attempts));
        return newAttempt;
    }

    getQuizAttempts() {
        const attempts = localStorage.getItem(this.STORAGE_KEYS.QUIZ_ATTEMPTS);
        return attempts ? JSON.parse(attempts) : [];
    }

    getQuizAttemptStats() {
        const attempts = this.getQuizAttempts();
        if (attempts.length === 0) return null;

        const totalAttempts = attempts.length;
        const scores = attempts.map(a => Number(a.score) || 0);
        const bestScore = Math.max(...scores);
        const accuracies = attempts.map(a => {
            if (a.accuracy !== undefined && a.accuracy !== null) {
                return Number(a.accuracy);
            }
            if (a.maxScore) {
                return (Number(a.score) / Number(a.maxScore)) * 100;
            }
            return 0;
        });
        const bestAccuracy = Math.max(...accuracies);
        const avgAccuracy = (accuracies.reduce((a, b) => a + b, 0) / totalAttempts).toFixed(1);

        return {
            totalAttempts,
            bestScore,
            bestAccuracy: Number(bestAccuracy.toFixed ? bestAccuracy.toFixed(0) : bestAccuracy),
            avgAccuracy: Number(avgAccuracy),
            allScores: scores,
            lastAttempt: attempts[attempts.length - 1]
        };
    }

    // ===== Leaderboard Management =====
    updateLeaderboard() { /* removed: leaderboard feature deprecated */ }
    getLeaderboard() { return []; }
    getLeaderboardByPeriod() { return []; }
    getStudentRank() { return null; }
    getTopScores() { return []; }

    // ===== Settings Management =====
    saveSettings(settings) {
        const currentSettings = this.getSettings();
        const newSettings = { ...currentSettings, ...settings };
        localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
        return newSettings;
    }

    getSettings() {
        const settings = localStorage.getItem(this.STORAGE_KEYS.SETTINGS);
        return settings ? JSON.parse(settings) : this.getDefaultSettings();
    }

    getDefaultSettings() {
        return {
            soundEnabled: true,
            timerEnabled: true,
            feedbackEnabled: true,
            theme: 'dark'
        };
    }

    // ===== User Statistics =====
    updateUserStats(statsUpdate) {
        const stats = this.getUserStats();
        const updated = { ...stats, ...statsUpdate, lastUpdated: new Date().toISOString() };
        localStorage.setItem(this.STORAGE_KEYS.USER_STATS, JSON.stringify(updated));
        return updated;
    }

    getUserStats() {
        const stats = localStorage.getItem(this.STORAGE_KEYS.USER_STATS);
        return stats ? JSON.parse(stats) : this.getDefaultUserStats();
    }

    getDefaultUserStats() {
        return {
            totalQuestionsAttempted: 0,
            correctAnswers: 0,
            totalTime: 0,
            categoryStats: {},
            streaks: {
                current: 0,
                highest: 0
            },
            lastUpdated: new Date().toISOString()
        };
    }

    updateCategoryStats(category, correct, total) {
        const stats = this.getUserStats();
        if (!stats.categoryStats[category]) {
            stats.categoryStats[category] = { correct: 0, total: 0 };
        }
        stats.categoryStats[category].correct += correct;
        stats.categoryStats[category].total += total;
        this.updateUserStats(stats);
        return stats;
    }

    // ===== Utility Methods =====
    getWeekNumber(date) {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

    getMonthNumber(date) {
        return date.getFullYear() * 12 + date.getMonth();
    }

    clearAllData() {
        Object.values(this.STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    }

    exportData() {
        return {
            quizAttempts: this.getQuizAttempts(),
            settings: this.getSettings(),
            userStats: this.getUserStats()
        };
    }

    importData(data) {
        if (data.quizAttempts) localStorage.setItem(this.STORAGE_KEYS.QUIZ_ATTEMPTS, JSON.stringify(data.quizAttempts));
        if (data.settings) localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
        if (data.userStats) localStorage.setItem(this.STORAGE_KEYS.USER_STATS, JSON.stringify(data.userStats));
    }
}

// Create global instance
const storage = new StorageManager();
