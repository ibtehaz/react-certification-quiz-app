class QuizTimer {
    constructor(duration = 20) {
        this.duration = duration;
        this.remaining = duration;
        this.isRunning = false;
        this.isPaused = false;
        this.intervalId = null;
        this.onTick = null;
        this.onComplete = null;
        this.onWarning = null;
        this.warningThreshold = 5;
    }

    start(callbacks = {}) {
        if (this.isRunning) return;
        
        this.onTick = callbacks.onTick;
        this.onComplete = callbacks.onComplete;
        this.onWarning = callbacks.onWarning;
        this.warningThreshold = callbacks.warningThreshold || 5;
        
        this.isRunning = true;
        this.isPaused = false;
        this.remaining = this.duration;

        this.intervalId = setInterval(() => this.tick(), 1000);
    }

    tick() {
        if (this.isPaused) return;

        this.remaining--;

        // Call onTick callback
        if (this.onTick) {
            this.onTick({
                remaining: this.remaining,
                percentage: (this.remaining / this.duration) * 100,
                isWarning: this.remaining <= this.warningThreshold && this.remaining > 0,
                isDanger: this.remaining <= 2
            });
        }

        // Call onWarning callback when reaching warning threshold
        if (this.remaining === this.warningThreshold && this.onWarning) {
            this.onWarning();
        }

        // Complete
        if (this.remaining <= 0) {
            this.complete();
        }
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        this.isRunning = false;
        this.isPaused = false;
        this.remaining = this.duration;
    }

    complete() {
        this.stop();
        if (this.onComplete) {
            this.onComplete();
        }
    }

    reset() {
        this.stop();
        this.remaining = this.duration;
    }

    getTime() {
        return {
            remaining: this.remaining,
            elapsed: this.duration - this.remaining,
            percentage: (this.remaining / this.duration) * 100,
            isRunning: this.isRunning,
            isPaused: this.isPaused
        };
    }

    setDuration(seconds) {
        this.duration = seconds;
        this.remaining = seconds;
    }
}

// Create a global timer instance
let quizTimer = null;

function createTimer(duration = 20) {
    if (quizTimer) {
        quizTimer.stop();
    }
    quizTimer = new QuizTimer(duration);
    return quizTimer;
}

function getTimer() {
    if (!quizTimer) {
        quizTimer = new QuizTimer();
    }
    return quizTimer;
}
