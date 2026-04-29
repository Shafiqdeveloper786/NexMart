import Link from "next/link";
import { ChevronDown, ArrowLeft } from "lucide-react";

const FAQS = [
  {
    id: "shipping",
    question: "How long does shipping take?",
    answer:
      "Standard shipping takes 3–7 business days. Express shipping (1–2 business days) is available at checkout for an additional fee. Orders placed before 2 PM PKT on business days are dispatched the same day.",
  },
  {
    id: "returns",
    question: "What is your returns policy?",
    answer:
      "We offer a 30-day hassle-free return policy. Items must be unused, in their original packaging, and accompanied by a receipt. To start a return, email us at hello@nexmart.com with your order number.",
  },
  {
    id: "payment",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards (Visa, Mastercard, Amex), bank transfers, and select mobile wallets. All transactions are secured with 256-bit SSL encryption.",
  },
  {
    id: "tracking",
    question: "How can I track my order?",
    answer:
      "Once your order ships you'll receive a confirmation email with a tracking link. You can also view real-time status by visiting My Orders in your account dashboard.",
  },
  {
    id: "cancel",
    question: "Can I cancel or modify my order?",
    answer:
      "Orders can be cancelled or modified within 1 hour of placement. After that the order enters fulfilment and can no longer be changed. Contact support immediately at hello@nexmart.com.",
  },
  {
    id: "account",
    question: "How do I reset my password?",
    answer:
      'Click "Forgot password?" on the login page and enter your email address. You\'ll receive a 4-digit verification code — enter it to set a new password.',
  },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Home
      </Link>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-foreground dark:text-white tracking-tight text-balance">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 text-base text-muted-foreground dark:text-slate-400">
          Can&apos;t find what you&apos;re looking for?{" "}
          <a href="mailto:hello@nexmart.com" className="underline underline-offset-4 hover:text-foreground dark:hover:text-white transition-colors">
            Email our support team
          </a>.
        </p>
      </div>

      {/* FAQ list */}
      <div className="space-y-3">
        {FAQS.map((faq) => (
          <details
            key={faq.id}
            id={faq.id}
            className="group rounded-2xl border border-border bg-card dark:bg-white/[0.03] dark:border-white/[0.07] overflow-hidden"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-foreground dark:text-slate-200 hover:bg-muted/50 dark:hover:bg-white/[0.04] transition-colors list-none">
              {faq.question}
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="border-t border-border dark:border-white/[0.06] px-5 py-4">
              <p className="text-sm text-muted-foreground dark:text-slate-400 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </details>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-2xl border border-border dark:border-white/[0.07] bg-muted/40 dark:bg-white/[0.03] px-6 py-8 text-center">
        <p className="text-sm font-semibold text-foreground dark:text-white mb-1">Still need help?</p>
        <p className="text-sm text-muted-foreground dark:text-slate-400 mb-4">
          Our support team is available Mon–Fri, 9am–6pm PKT.
        </p>
        <a
          href="mailto:hello@nexmart.com"
          className="inline-flex items-center rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background hover:opacity-80 transition-opacity"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}
