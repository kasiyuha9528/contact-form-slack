"use server";

import { z } from "zod";
import { contactSchema, type ContactFormState } from "@/lib/contact-schema";
import { sendSlackNotification } from "@/lib/slack";

// フォームの「送信する」を押したときに、サーバー側で実行される関数(Server Action)。
// 第1引数 _prevState は、前回の結果。useActionState を使うと自動で渡される(今回は使わない)。
// 第2引数 formData は、フォームの入力内容。input の name 属性の名前で取り出せる。
export async function submitContact(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // FormData.get() は、値がないと null を返すことがある。
  // 「?? ""」で空文字に置き換え、必ず文字列として扱えるようにする。
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  // safeParse:ルールに合っているかを調べる。エラーを投げず、結果を返してくれる。
  const result = contactSchema.safeParse(values);

  if (!result.success) {
    return {
      status: "error",
      // flattenError:エラーを「項目名ごとのメッセージ一覧」に整える
      errors: z.flattenError(result.error).fieldErrors,
      values, // 入力した内容を返して、画面に残す
    };
  }

  // チェックを通過したので、Slackに通知する。
  // result.data は、前後の空白を取り除いた後の、正しい形のデータ。
  try {
    await sendSlackNotification(result.data);
  } catch (error) {
    // 詳しい原因は、サーバー側のログにだけ残す(ユーザーには見せない)。
    // error 全体ではなく message だけを出し、秘密情報が混ざらないようにしている。
    console.error(
      "Slack通知エラー:",
      error instanceof Error ? error.message : "不明なエラー",
    );
    return {
      status: "error",
      errors: {},
      values, // 入力内容は残して、もう一度送れるようにする
      formError:
        "送信できませんでした。お手数ですが、しばらくしてからもう一度お試しください。",
    };
  }

  return {
    status: "success",
    errors: {},
    values: { name: "", email: "", message: "" }, // 成功したら入力欄を空に戻す
  };
}
