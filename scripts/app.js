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
        document.getElementById('feedbackToggle').addEventListener('change', (e) => {
            storage.saveSettings({ feedbackEnabled: e.target.checked });
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
        
        // Show explanation: always for incorrect answers; optional for correct
        if (storage.getSettings().feedbackEnabled) {
            const hasExplicit = Boolean(question.explanation);
            let explanation;

            if (hasExplicit) {
                explanation = question.explanation;
            } else if (answer.isCorrect) {
                explanation = 'Great job! That is the correct answer.';
            } else {
                // Generate comprehensive educational feedback
                explanation = this.generateComprehensiveFeedback(question, answer);
            }

            const reference = question.reference || '';

            // Prefer showing for incorrect, but also show explicit explanations for correct answers
            if (!answer.isCorrect || hasExplicit) {
                ui.showFeedback(answer.isCorrect, explanation, reference);
            }
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
        document.getElementById('feedbackToggle').checked = settings.feedbackEnabled;
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

    generateComprehensiveFeedback(question, answer) {
        const tags = question.tags || [];
        const category = question.category || '';
        
        // Build concept-specific educational feedback
        let conceptExplanation = '';
        let definition = '';
        let intuition = '';
        
        // Determine primary concept from tags and category
        const allConcepts = [...tags, category].map(c => c.toLowerCase());
        
        // JSX Concepts
        if (allConcepts.some(c => c.includes('jsx'))) {
            definition = '<strong>JSX (JavaScript XML)</strong> is a syntax extension for JavaScript that allows you to write HTML-like code within JavaScript. ';
            intuition = 'Think of JSX as a templating language with the full power of JavaScript. It gets compiled to regular JavaScript function calls (React.createElement). ';
            conceptExplanation = 'JSX makes React components more readable and allows you to see the UI structure directly in your code. ';
        }
        
        // Hooks Concepts
        if (allConcepts.some(c => c.includes('hook') || c === 'usestate' || c === 'useeffect' || c === 'usecontext' || c === 'usereducer' || c === 'useref' || c === 'usememo' || c === 'usecallback')) {
            definition = '<strong>React Hooks</strong> are functions that let you "hook into" React state and lifecycle features from function components. ';
            intuition = 'Hooks allow functional components to have state and side effects, which previously required class components. They make code more reusable and easier to understand. ';
            
            if (allConcepts.includes('usestate')) {
                conceptExplanation = '<strong>useState</strong> returns a stateful value and a function to update it. The state persists between re-renders, and calling the setter triggers a re-render. ';
            } else if (allConcepts.includes('useeffect')) {
                conceptExplanation = '<strong>useEffect</strong> lets you perform side effects (data fetching, subscriptions, DOM updates) in function components. It runs after render and can clean up when the component unmounts or dependencies change. ';
            } else if (allConcepts.includes('usecontext')) {
                conceptExplanation = '<strong>useContext</strong> allows you to consume context values without prop drilling. It subscribes to context changes and re-renders when the context value updates. ';
            } else if (allConcepts.includes('usereducer')) {
                conceptExplanation = '<strong>useReducer</strong> is an alternative to useState for complex state logic. It accepts a reducer function and returns the current state paired with a dispatch method, similar to Redux. ';
            } else if (allConcepts.includes('useref')) {
                conceptExplanation = '<strong>useRef</strong> creates a mutable reference that persists across renders without causing re-renders when updated. Commonly used for DOM access and storing mutable values. ';
            } else if (allConcepts.includes('usememo')) {
                conceptExplanation = '<strong>useMemo</strong> memoizes expensive computations and only recalculates when dependencies change, optimizing performance by avoiding unnecessary calculations. ';
            } else if (allConcepts.includes('usecallback')) {
                conceptExplanation = '<strong>useCallback</strong> memoizes function references to prevent unnecessary re-creations, which is crucial when passing callbacks to optimized child components. ';
            } else {
                conceptExplanation = 'Hooks follow specific rules: only call them at the top level (not in loops/conditions) and only in React functions. ';
            }
        }
        
        // State & Props
        if (allConcepts.some(c => c.includes('state') || c.includes('props'))) {
            if (allConcepts.some(c => c.includes('props'))) {
                definition = '<strong>Props (Properties)</strong> are read-only inputs passed from parent to child components. ';
                intuition = 'Props enable data flow down the component tree. Think of them as function parameters for components—they configure how a component renders but cannot be modified by the component itself. ';
                conceptExplanation = 'Props allow parent components to pass data and event handlers to children, creating a unidirectional data flow that makes apps predictable and easier to debug. ';
            }
            if (allConcepts.some(c => c.includes('state') && !c.includes('usestate'))) {
                definition = '<strong>State</strong> is data that changes over time and causes components to re-render when updated. ';
                intuition = 'State is like a component\'s memory. When state changes, React re-renders the component to reflect the new data. Unlike props, state is managed within the component itself. ';
                conceptExplanation = 'State should contain the minimal amount of data needed to represent UI changes. Derived values should be calculated during render rather than stored in state. ';
            }
        }
        
        // Events
        if (allConcepts.some(c => c.includes('event'))) {
            definition = '<strong>React Events</strong> are synthetic cross-browser wrappers around native browser events. ';
            intuition = 'Event handlers in React use camelCase (onClick, onChange) instead of lowercase. React\'s synthetic event system normalizes events across browsers for consistency. ';
            conceptExplanation = 'React events automatically bind to the component, and you can call preventDefault() or stopPropagation() just like native events. ';
        }
        
        // Forms
        if (allConcepts.some(c => c.includes('form') || c.includes('controlled') || c.includes('uncontrolled'))) {
            definition = '<strong>Controlled Components</strong> have form data handled by React state, while <strong>Uncontrolled Components</strong> store data in the DOM. ';
            intuition = 'In controlled components, React is the "single source of truth" for input values. Every keystroke updates state, which then updates the input—creating a controlled loop. ';
            conceptExplanation = 'Controlled components give you full control over form data validation and submission, while uncontrolled components are simpler for basic forms using refs. ';
        }
        
        // Context
        if (allConcepts.some(c => c.includes('context'))) {
            definition = '<strong>Context</strong> provides a way to pass data through the component tree without manually passing props at every level. ';
            intuition = 'Context solves "prop drilling"—instead of passing props through many intermediate components, you can provide data at a high level and consume it anywhere below. ';
            conceptExplanation = 'Use Context for truly global data (theme, auth, locale). For local state, prefer props. Context consumers re-render when the context value changes. ';
        }
        
        // Performance
        if (allConcepts.some(c => c.includes('memo') || c.includes('performance') || c.includes('lazy') || c.includes('suspense'))) {
            definition = '<strong>React Performance Optimization</strong> involves preventing unnecessary re-renders and lazy-loading code. ';
            intuition = 'React.memo wraps components to skip re-renders when props haven\'t changed (shallow comparison). React.lazy and Suspense enable code-splitting, loading components only when needed. ';
            conceptExplanation = 'Optimize judiciously—premature optimization can make code complex. Profile first, then optimize bottlenecks with memo, useMemo, useCallback, or code splitting. ';
        }
        
        // Rendering & Virtual DOM
        if (allConcepts.some(c => c.includes('render') || c.includes('vdom') || c.includes('diffing') || c.includes('reconcil'))) {
            definition = '<strong>Virtual DOM</strong> is a lightweight in-memory representation of the real DOM. React updates the Virtual DOM first, then efficiently applies minimal changes to the real DOM. ';
            intuition = 'Think of Virtual DOM as a blueprint. React compares the old and new blueprints (reconciliation/diffing), calculates the differences, and only updates what changed in the actual DOM. ';
            conceptExplanation = 'This diffing algorithm makes React fast—instead of re-rendering entire UIs, it updates only what\'s necessary, minimizing expensive DOM operations. ';
        }
        
        // Lifecycle
        if (allConcepts.some(c => c.includes('lifecycle') || c.includes('mount') || c.includes('unmount'))) {
            definition = '<strong>Component Lifecycle</strong> refers to the stages a component goes through: mounting (creation), updating (re-rendering), and unmounting (removal). ';
            intuition = 'In function components, useEffect handles lifecycle events: running code after mount, cleanup on unmount, and updates when dependencies change. ';
            conceptExplanation = 'Understanding lifecycle helps you manage side effects, subscriptions, and cleanup properly to avoid memory leaks and bugs. ';
        }
        
        // Lists & Keys
        if (allConcepts.some(c => c.includes('key') || c.includes('list'))) {
            definition = '<strong>Keys</strong> help React identify which items in a list have changed, been added, or removed. ';
            intuition = 'Keys should be stable, unique IDs (like database IDs). Avoid using array indexes as keys when items can be reordered, added, or deleted—this causes bugs. ';
            conceptExplanation = 'Keys enable React\'s reconciliation algorithm to efficiently update lists by tracking element identity across renders. ';
        }
        
        // Router
        if (allConcepts.some(c => c.includes('router') || c.includes('route'))) {
            definition = '<strong>React Router</strong> enables client-side routing, allowing navigation between views without full page reloads. ';
            intuition = 'React Router matches URLs to components, updates the browser history, and enables nested routes, making SPAs feel like multi-page apps. ';
            conceptExplanation = 'Client-side routing improves performance and UX by only updating the parts of the page that change, without requesting new HTML from the server. ';
        }
        
        // Error Boundaries
        if (allConcepts.some(c => c.includes('error'))) {
            definition = '<strong>Error Boundaries</strong> are React components that catch JavaScript errors anywhere in their child component tree. ';
            intuition = 'Error boundaries act like try-catch blocks for components. They prevent the entire app from crashing when one component has an error. ';
            conceptExplanation = 'Error boundaries must be class components using componentDidCatch or getDerivedStateFromError. They\'re essential for resilient UIs. ';
        }
        
        // SSR
        if (allConcepts.some(c => c.includes('ssr') || c.includes('server'))) {
            definition = '<strong>Server-Side Rendering (SSR)</strong> renders React components on the server and sends HTML to the client. ';
            intuition = 'SSR improves initial load time and SEO by delivering fully-rendered HTML instead of an empty page that needs JavaScript to populate. ';
            conceptExplanation = 'After SSR delivers HTML, React "hydrates" it on the client, attaching event handlers and making it interactive. ';
        }
        
        // Fragments
        if (allConcepts.some(c => c.includes('fragment'))) {
            definition = '<strong>Fragments</strong> let you group multiple children without adding extra nodes to the DOM. ';
            intuition = 'Use <React.Fragment> or the shorthand <></> when you need to return multiple elements but don\'t want a wrapper div cluttering your DOM. ';
            conceptExplanation = 'Fragments keep the DOM clean and improve accessibility by avoiding unnecessary nesting. ';
        }
        
        // If we couldn't match specific concepts, provide general guidance
        if (!definition) {
            definition = '<strong>React Fundamentals:</strong> React is a declarative, component-based library for building user interfaces. ';
            intuition = 'Components are reusable building blocks. State and props manage data flow. React efficiently updates the DOM when data changes. ';
            conceptExplanation = 'Understanding these core concepts—components, JSX, state, props, and lifecycle—forms the foundation for mastering React. ';
        }
        
        // Construct the full feedback message
        const correctAnswerStatement = `<strong>The correct answer is:</strong> "${answer.correctAnswer}"<br><br>`;
        const whySection = `<strong>Why?</strong> ${conceptExplanation}<br><br>`;
        const definitionSection = `<strong>Concept:</strong> ${definition}<br><br>`;
        const intuitionSection = `<strong>Understanding:</strong> ${intuition}`;
        
        return correctAnswerStatement + whySection + definitionSection + intuitionSection;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new QuizApp();
    console.log('⚛️ ReactMastery Quiz App initialized');
});
