const functions = require('firebase-functions');
const requestLib = require('request');

class SlackPraiseBot {
    constructor(request, response) {
        this.request = request;
        this.response = response;
        this.body = this.request.body;

        this.main();
    }
    main() {
        this.token = functions.config().slack.oauth_token;

        if (!this.canResponseToSlack()) {
            this.responseEmptyWithChallenge();
            return;
        }

        this.postToSlack().then((response, body) => {
            this.responseEmptyWithChallenge();
            return;
        }).catch(error => {
            this.responseEmptyWithChallenge();
        });
    }

    makeHeaders() {
        return {
            'Authorization': "Bearer " + this.token,
            'Content-type': 'application/x-www-form-urlencoded',
        }
    }

    isTargetOfPraise() {
        const {
            text
        } = this.body.event;
        return text && (text.endsWith('だよ') || text.endsWith('たよ'))
    }

    canResponseToSlack() {
        return this.body.event && !this.body.event.subtype && this.isTargetOfPraise(this.body.event.text);
    }

    responseEmptyWithChallenge() {
        this.response.status(200).set('Content-Type', 'text/plain').send(this.body.challenge).end();
    }

    makeResponse() {
        const text = this.body.event.text;
        let random = Math.floor(Math.random() * 3);
        let word = ['えらーい', 'すごーい', 'すきー！'][random];
        let textSuffixRemoved = text.slice(0, -2);
        if (text.endsWith('だよ')) {
            textSuffixRemoved += 'で' + word;
            return textSuffixRemoved;
        }
        textSuffixRemoved += 'て' + word;
        return textSuffixRemoved;
    }

    postToSlack() {
        var options = {
            url: 'https://slack.com/api/chat.postMessage',
            method: 'POST',
            headers: this.makeHeaders(),
            form: {
                token: this.token,
                channel: this.body.event.channel,
                text: this.makeResponse(),
            }
        }

        return new Promise((resolve, reject) => {
            requestLib(options, (error, response, body) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(response, body);
            });
        });
    }
}

/**
 * 〜〜だよ、または〜〜たよという言葉に反応して肯定するBot
 */
exports.slackPraiseBot = functions.https.onRequest((request, response) => {
    new SlackPraiseBot(request, response)
});
