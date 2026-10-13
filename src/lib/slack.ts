import type { ContactInput } from "@/lib/contact-schema";

// Slackの文章では、「&」「<」「>」が特別な意味を持つ。
// 例:「<!channel>」と入力されると、チャンネル全員へのメンションになってしまう。
// ユーザーの入力をそのまま送らないよう、無害な形に置き換える(エスケープ)。
function escapeSlackText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// 送信日時を、日本時間の「2026/10/13 14:30:05」の形にする。
// Vercelなどのサーバーは、日本時間ではないことが多いため、時間帯を明示する。
function formatJst(date: Date): string {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23", // 0時を「24時」と表示しないようにする
  }).format(date);
}

// Slack Incoming Webhook に、お問い合わせの通知をPOSTする。
// 失敗したときは、エラーを投げる(呼び出し側で、画面にエラーを出すため)。
export async function sendSlackNotification(input: ContactInput): Promise<void> {
  // Webhook URLは、コードに直接書かず、環境変数から読み取る。
  // NEXT_PUBLIC_ を付けていないので、ブラウザ側には公開されない。
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error("環境変数 SLACK_WEBHOOK_URL が設定されていません");
  }

  const name = escapeSlackText(input.name);
  const email = escapeSlackText(input.email);
  const message = escapeSlackText(input.message);
  const sentAt = formatJst(new Date());

  const payload = {
    // text:スマートフォンの通知など、整形した表示が使えない場所で出る文章
    text: `新しいお問い合わせ:${name} 様`,
    // blocks:Slackの画面に出る、整形した表示(Block Kit)
    blocks: [
      {
        type: "header",
        text: { type: "plain_text", text: "新しいお問い合わせ" },
      },
      {
        // fields:項目を2列で並べる
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*お名前*\n${name}` },
          { type: "mrkdwn", text: `*メールアドレス*\n${email}` },
          { type: "mrkdwn", text: `*送信日時*\n${sentAt}` },
        ],
      },
      {
        type: "section",
        text: { type: "mrkdwn", text: `*お問い合わせ内容*\n${message}` },
      },
    ],
  };

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    // Slackが応答しないとき、いつまでも待たないようにする(10秒)
    signal: AbortSignal.timeout(10_000),
  });

  // response.ok:HTTPのステータスが200番台のとき true。
  // Slackは、成功すると 200 を返す。
  if (!response.ok) {
    // URLは秘密情報なので、エラーメッセージには含めない
    throw new Error(`Slackへの通知に失敗しました(HTTP ${response.status})`);
  }
}
