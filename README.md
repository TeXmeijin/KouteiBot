# このbotについて
登録したSlack Workspaceで「〜たよ」「〜だよ」という報告を見かけると無差別に「えらーい！」と褒めてくれます

# セットアップ
## Slack bot registration
https://qiita.com/namutaka/items/233a83100c94af033575#bot-users-event-api%E5%88%A9%E7%94%A8

上記記事を参考にセットアップしました

## firebase config
firebase configにてSlack botのoauth_tokenを登録してください

`firebase deploy --only functions`

でデプロイできます。