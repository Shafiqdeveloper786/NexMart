import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const SECTIONS = [
  {
    title: "Information We Collect",
    body: "We collect information you provide directly (name, email, shipping address, payment details) when you create an account or place an order. We also collect usage data such as pages visited, search queries, and device information to improve our service.",
  },
  {
    title: "How We Use Your Information",
    body: "We use your data to process orders, send transactional emails (order confirmations, shipping updates, OTP codes), personalise product recommendations, and improve our platform. We never sell your personal information to third parties.",
  },
  {
    title: "Data Storage & Security",
    body: "Your data is stored on secure MongoDB Atlas servers with encryption at rest and in transit. Passwords are hashed using bcrypt and are never stored in plain text. We regularly audit our infrastructure for vulnerabilities.",
  },
  {
    title: "Cookies",
    body: "NexMart uses strictly necessary cookies to maintain your session and shopping cart. We do not use advertising or tracking cookies. You can disable cookies in your browser settings, though some features may not function correctly.",
  },
  {
    title: "Third-Party Services",
    body: "We use Google OAuth for social sign-in, Resend/Nodemailer for transactional email, and MongoDB Atlas for data storage. Each third party has its own privacy policy governing data they handle on our behalf.",
  },
  {
    title: "Your Rights",
    body: "You have the right to access, correct, or delete your personal data at any time. To exercise these rights, email us at hello@nexmart.com. We will respond within 30 days.",
  },
  {
    title: "Changes to This Policy",
    body: "We may update this policy periodically. Significant changes will be communicated via email or a prominent notice on the site. Continued use of NexMart after changes constitutes acceptance of the updated policy.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Home
      </Link>

      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-foreground dark:text-white tracking-tight text-balance">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-muted-foreground dark:text-slate-400">
          Last updated: April 2026 &nbsp;·&nbsp; Effective immediately
        </p>
        <p className="mt-4 text-base text-muted-foreground dark:text-slate-400 leading-relaxed">
          NexMart (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is committed to protecting your privacy.
          This policy explains what data we collect, how we use it, and your rights regarding it.
        </p>
      </div>

      <div className="space-y-8">
        {SECTIONS.map((section, i) => (
          <section key={i}>
            <h2 className="text-base font-bold text-foreground dark:text-white mb-2">
              {i + 1}. {section.title}
            </h2>
            <p className="text-sm text-muted-foreground dark:text-slate-400 leading-relaxed">
              {section.body}
            </p>
          </section>
        ))}
      </div>

      <div className="mt-12 border-t border-border dark:border-white/[0.07] pt-8">
        <p className="text-sm text-muted-foreground dark:text-slate-400">
          Questions about this policy?{" "}
          <a href="mailto:hello@nexmart.com" className="underline underline-offset-4 hover:text-foreground dark:hover:text-white transition-colors">
            hello@nexmart.com
          </a>
        </p>
        <div className="flex gap-4 mt-4">
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground dark:hover:text-white underline underline-offset-4 transition-colors">
            Terms of Service
          </Link>
          <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground dark:hover:text-white underline underline-offset-4 transition-colors">
            FAQ
          </Link>
        </div>
      </div>
    </div>
  );
}
