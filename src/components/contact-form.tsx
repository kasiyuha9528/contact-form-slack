"use client";

import { useActionState } from "react";
import { submitContact } from "@/app/actions";
import type { ContactFormState } from "@/lib/contact-schema";

// 3つの入力欄で共通して使う見た目(Tailwindのクラス)。
// 枠線の色だけは、エラーのときに切り替えるため、別に分けている。
const fieldBase =
  "mt-2 block w-full rounded-lg border bg-white px-3.5 py-2.5 " +
  "text-base text-zinc-900 shadow-sm transition placeholder:text-zinc-400 " +
  "focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 " +
  "dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 " +
  "dark:focus:border-emerald-500 dark:focus:ring-emerald-500/30";
const borderNormal = "border-zinc-300 dark:border-zinc-700";
const borderError = "border-red-600 dark:border-red-500";

const labelClass = "block text-sm font-medium text-zinc-800 dark:text-zinc-200";

// 入力欄のクラス名を作る。エラーがあるときは、枠線を赤にする。
function fieldClass(hasError: boolean, extra = "") {
  return `${fieldBase} ${hasError ? borderError : borderNormal} ${extra}`;
}

// 「必須」の目印
function RequiredBadge() {
  return (
    <span className="ml-2 rounded bg-emerald-50 px-1.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
      必須
    </span>
  );
}

// 入力欄の下に出すエラーメッセージ。エラーがなければ何も表示しない。
function FieldError({ id, messages }: { id: string; messages?: string[] }) {
  if (!messages || messages.length === 0) return null;
  return (
    <p id={id} className="mt-2 text-sm text-red-700 dark:text-red-400">
      {messages[0]}
    </p>
  );
}

// 最初の状態(まだ何も送信していない)
const initialState: ContactFormState = {
  status: "idle",
  errors: {},
  values: { name: "", email: "", message: "" },
};

export function ContactForm() {
  // useActionState:Server Action(submitContact)の結果を state として受け取る。
  //   state      … 最新の結果(エラーや入力値が入っている)
  //   formAction … form の action に渡す関数
  //   pending    … 送信中かどうか(true の間は、ボタンを押せないようにする)
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialState,
  );
  const { errors, values } = state;

  return (
    // noValidate:ブラウザ標準のチェックを止める(チェックはzodが行うため)
    <form action={formAction} noValidate className="space-y-6">
      <div>
        <label htmlFor="name" className={labelClass}>
          お名前
          <RequiredBadge />
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="山田 太郎"
          // defaultValue:エラーで再表示されても、入力した内容が消えないようにする
          defaultValue={values.name}
          // aria-invalid / aria-describedby:スクリーンリーダーに、エラーの有無と内容を伝える
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={fieldClass(!!errors.name)}
        />
        <FieldError id="name-error" messages={errors.name} />
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          メールアドレス
          <RequiredBadge />
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="example@example.com"
          defaultValue={values.email}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={fieldClass(!!errors.email)}
        />
        <FieldError id="email-error" messages={errors.email} />
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          お問い合わせ内容
          <RequiredBadge />
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          placeholder="お問い合わせ内容をご記入ください"
          defaultValue={values.message}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={fieldClass(!!errors.message, "resize-y")}
        />
        <FieldError id="message-error" messages={errors.message} />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-emerald-700 px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-500 dark:text-zinc-950 dark:hover:bg-emerald-400 dark:focus-visible:ring-offset-zinc-900"
      >
        {pending ? "送信中…" : "送信する"}
      </button>

      {/* 入力チェックを通過したときのメッセージ。
          ステップ4でSlack通知を追加するまでは、確認用の仮の表示。 */}
      {state.status === "success" && (
        <p
          role="status"
          className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
        >
          入力内容の確認が完了しました。
        </p>
      )}
    </form>
  );
}
