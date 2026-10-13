import { ContactForm } from "@/components/contact-form";

export default function Home() {
  return (
    // 画面全体の背景。カードを上下左右の中央に置く
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
      {/* フォームを載せるカード */}
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm sm:p-10 dark:border-zinc-800 dark:bg-zinc-900">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            お問い合わせ
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            ご質問・ご相談は、下のフォームからお送りください。
            内容を確認のうえ、担当者よりご連絡いたします。
          </p>
        </header>

        <ContactForm />
      </div>
    </main>
  );
}
