const functions = require('firebase-functions');
const request = require('request');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.slackIdealize = functions.https.onRequest((request, response) => {
    const body = request.body;
    console.log(body);

    //ヘッダーを定義
    var headers = {
        'Content-Type': 'application/json'
    }

    //オプションを定義
    var options = {
        url: 'https://slack.com/api/chat.postMessage',
        method: 'POST',
        headers: headers,
        json: true,
        form: {
            token: 'xoxb-387261628675-571774016866-ZXaiTVws3f1iAuF1VeCudnFh',
            channel: body.event.channel,
            text: 'わあああああ。こんばんは',
        }
    }

    //リクエスト送信
    request(options, (_, _, slackApiPostBody) => {
        //コールバックで色々な処理
        console.log(slackApiPostBody);
        response.status(200).send(body.challenge).end();
    });
});
