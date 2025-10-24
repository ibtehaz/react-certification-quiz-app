class LiveConnection {
    constructor() {
        // IMPORTANT: Replace with your own Pusher credentials
        this.pusher = new Pusher('YOUR_PUSHER_APP_KEY', {
            cluster: 'YOUR_PUSHER_APP_CLUSTER',
            encrypted: true
        });
        this.channel = null;
        this.gamePin = null;
    }

    generatePin() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // ===== HOST METHODS =====

    hostGame(callbacks) {
        this.gamePin = this.generatePin();
        const channelName = `presence-quiz-${this.gamePin}`;
        this.channel = this.pusher.subscribe(channelName);

        // --- Bind all host-side events ---
        this.channel.bind('pusher:subscription_succeeded', () => {
            callbacks.onHostSuccess(this.gamePin);
        });

        this.channel.bind('pusher:member_added', (member) => {
            callbacks.onPlayerJoined(member.info);
        });

        this.channel.bind('pusher:member_removed', (member) => {
            callbacks.onPlayerLeft(member.id);
        });

        this.channel.bind('client-player-answer', (data) => {
            callbacks.onPlayerAnswer(data);
        });
    }

    sendEventToPlayers(eventName, data) {
        if (!this.channel) return;
        this.channel.trigger(`client-${eventName}`, data);
    }


    // ===== PLAYER METHODS =====

    joinGame(pin, playerData, callbacks) {
        this.gamePin = pin;
        const channelName = `presence-quiz-${this.gamePin}`;
        
        // Custom authenticator for presence channels
        this.pusher.config.authEndpoint = 'https://your-auth-server.com/pusher/auth'; // Placeholder
        this.pusher.config.auth = { params: playerData };

        this.channel = this.pusher.subscribe(channelName);

        // --- Bind all player-side events ---
        this.channel.bind('pusher:subscription_succeeded', () => {
            callbacks.onJoinSuccess(this.channel.members.me);
        });

        this.channel.bind('pusher:subscription_error', (status) => {
            callbacks.onJoinError(status);
        });

        this.channel.bind('client-start-game', (data) => {
            callbacks.onGameStart(data);
        });
        
        this.channel.bind('client-next-question', (data) => {
            callbacks.onNextQuestion(data);
        });

        this.channel.bind('client-show-results', (data) => {
            callbacks.onShowResults(data);
        });

        this.channel.bind('client-game-over', (data) => {
            callbacks.onGameOver(data);
        });
    }

    sendAnswerToHost(answerData) {
        if (!this.channel) return;
        this.channel.trigger('client-player-answer', answerData);
    }


    // ===== GENERAL METHODS =====

    disconnect() {
        if (this.channel) {
            this.pusher.unsubscribe(this.channel.name);
            this.channel = null;
            this.gamePin = null;
        }
    }
}

const liveConnection = new LiveConnection();
