# 問い合わせフォーム + Slack通知

ホームページの問い合わせフォームに送信された内容を、担当者(総務)のSlackに自動で通知するアプリです。
案件No.03(初級)を題材に、Next.jsでの開発の流れを学ぶことを目的としています。

- 推奨スタック:Next.js(App Router)+ TypeScript + Tailwind CSS + zod + Slack Incoming Webhook + Vercel
- 詳しい解説と用語集:[docs/learning-notes.md](docs/learning-notes.md)

## 要件

1. name / email / message の3項目フォームを作る
2. 送信時に zod でバリデーションする
3. Slack Incoming Webhook に POST して通知する

## 達成基準

- [ ] 空欄送信やメール形式不正でフォームが弾く
- [ ] 送信成功時に Slackチャンネルに通知が届く
- [ ] Webhook URL は環境変数で管理され、リポジトリにコミットされていない

## 進行ルート

| ステップ | 内容 | 状況 |
|---|---|---|
| 0 | 要件確認 | 完了 |
| 1 | Next.jsプロジェクトの作成 | 完了 |
| 2 | フォーム画面の作成(name / email / message) | 完了 |
| 3 | zodスキーマの作成とバリデーション | 未着手 |
| 4 | Slack Incoming Webhookへの通知処理(サーバー側) | 未着手 |
| 5 | 環境変数でWebhook URLを管理 | 未着手 |
| 6 | 動作確認(空欄、メール形式不正、送信成功) | 未着手 |
| 7 | Vercelへのデプロイ | 未着手 |
| 8 | README.mdと学習ノートの仕上げ | 未着手 |

## このプロジェクトで学んだこと(概要)

各ステップが終わるたびに追記します。詳細は学習ノートを参照してください。

### ステップ1:プロジェクトの作成
- `create-next-app` のオプションで、言語・CSS・ルーターなどの構成を最初に決められる
- Next.jsの雛形は、画面を作る `src/app/` と、設定ファイルに分かれている
- `.gitignore` の `.env*` により、秘密情報を入れる環境変数ファイルはGitに入らない
- `npm install` 時の脆弱性警告は、内容を確認せずに `npm audit fix --force` を実行しない
- `npm run dev` で開発サーバーを起動し、`http://localhost:3000` で確認できる

### ステップ2:フォーム画面の作成
- 画面は「ページ(`page.tsx`)」と「部品(`contact-form.tsx`)」に分けると、後から機能を足しやすい
- Tailwind CSSは、小さなクラス名を組み合わせて見た目を作る。`dark:` を付けると、PCのダークモードのときだけ別の見た目にできる
- 共通の見た目は変数にまとめると、修正が1か所で済む
- `label` と `input` は `htmlFor` と `id` で結び付ける。入力欄の `name` は、次のステップで送信内容を取り出す目印になる
- ブラウザ標準のチェックは `noValidate` で止め、チェックはzodに任せる
- ボタンを押したときの処理や、エラー表示を持つ部品は `"use client"`(ブラウザ側で動く部品)にする

## 開発の始め方

```bash
npm install
npm run dev
```

`http://localhost:3000` をブラウザで開くと確認できます。
