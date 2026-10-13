import { z } from "zod";

// 問い合わせフォームの「入力ルール」を1か所にまとめたファイル。
// エラーメッセージの文言も、ここで決めている。
export const contactSchema = z.object({
  name: z
    .string()
    .trim() // 前後の空白を取り除く(空白だけの入力を「空欄」として扱うため)
    .min(1, "お名前を教えてください")
    .max(50, "お名前は50文字以内でご入力ください"),

  // 空欄も、形式が正しくない場合も、同じメッセージにしている
  email: z.email("メールアドレスをご確認ください"),

  message: z
    .string()
    .trim()
    .min(10, "お問い合わせ内容を10文字以上でご入力ください")
    .max(1000, "お問い合わせ内容は1000文字以内でご入力ください"),
});

// ルールから、データの型を自動で作る(ルールと型がずれない)
export type ContactInput = z.infer<typeof contactSchema>;

// 送信処理(Server Action)が、画面に返す結果の形
export type ContactFormState = {
  // idle:まだ送信していない / error:入力に問題がある / success:チェックを通過した
  status: "idle" | "error" | "success";
  // 項目ごとのエラーメッセージ(例:{ name: ["お名前を教えてください"] })
  errors: Partial<Record<keyof ContactInput, string[]>>;
  // 入力欄に残しておく値(エラー時に、入力した内容が消えないようにするため)
  values: ContactInput;
  // 項目ごとではない、全体のエラー(例:Slackへの通知に失敗したとき)
  formError?: string;
};
