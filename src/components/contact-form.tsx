"use client";

import type { FormEvent } from "react";

// 3つの入力欄で共通して使う見た目(Tailwindのクラス)をまとめておく。
// 同じ長いクラス名を3回書かずに済み、見た目を変えたいときも1か所の修正で済む。
const fieldClass =
  "mt-2 block w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 " +
  "text-base text-zinc-900 shadow-sm transition placeholder:text-zinc-400 " +
  "focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 " +
  "dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 " +
  "dark:focus:border-emerald-500 dark:focus:ring-emerald-500/30";

const labelClass = "block text-sm font-medium text-zinc-800 dark:text-zinc-200";

// 「必須」の目印
function RequiredBadge() {
  return (
    <span className="ml-2 rounded bg-emerald-50 px-1.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
      必須
    </span>
  );
}

export function ContactForm() {
  // ステップ2では送信処理をまだ作らないため、ボタンを押しても何も起きないようにしている。
  // ステップ3〜4で、zodによるチェックとSlack通知を行う Server Action に置き換える。
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    // noValidate:ブラウザ標準のチェックを止める。
    // チェックは後のステップでzodが行い、エラーメッセージも自分で決めるため。
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
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
          className={fieldClass}
        />
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
          className={fieldClass}
        />
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
          className={`${fieldClass} resize-y`}
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-emerald-700 px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:bg-emerald-500 dark:text-zinc-950 dark:hover:bg-emerald-400 dark:focus-visible:ring-offset-zinc-900"
      >
        送信する
      </button>
    </form>
  );
}
