import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const SECTIONS = [
  {
    title: "Acceptance of Terms",
    body: "By accessing or using NexMart you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please discontinue use of the platform immediately.",
  },
  {
    title: "Use of the Platform",
    body: "NexMart is for personal, non-commercial use. You may not use automated tools to scrape, crawl, or interact with the platform. You are responsible for maintaining the confidentiality of your account credentials.",
  },
  {
    title: "Product Listings & Pricing",
    body: "All prices are displayed in USD and are subject to change without notice. We reserve the right to cancel orders if a product is mispriced or out of stock. You will be notified and fully refunded in such cases.",
  },
  {
    title: "Orders & Payment",
    body: "An order confirmation email does not constitute acceptance of your order. NexMart reserves the right to reject or cancel any order at its discretion. Payment is processed securely at the time of checkout.",
  },
  {
    title: "Returns & Refunds",
    body: "Eligible items may be returned within 30 days of delivery in original, unused condition. Refunds are processed within 5–10 business days after we receive the returned item. Shipping costs are non-refundable unless the return is due to our error.",
  },
  {
    title: "Intellectual Property",
    body: "All content on NexMart — including text, graphics, logos, and software — is the property of NexMart or its content suppliers and is protected by copyright law. You may not reproduce or distribute any content without written permission.",
  },
  {
    title: "Limitation of Liability",
    body: "NexMart is provided on an 'as is' basis. We make no warranties, express or implied, regarding the platform's availability or accuracy. To the maximum extent permitted by law, NexMart shall not be liable for any indirect or consequential damages.",
  },
  {
    title: "Governing Law",
    body: "These terms are governed by the laws of Pakistan. Any disputes shall be resolved in the courts of Lahore, Punjab, Pakistan.",
  },
  {
    title: "Changes to Terms",
    body: "We may update these terms at any time. Continued use of NexMart after changes are posted constitutes your acceptance. We will notify registered users of material changes via email.",
  },
];

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-muted-foreground dark:text-slate-400">
          Last updated: April 2026 &nbsp;·&nbsp; Effective immediately
        </p>
        <p className="mt-4 text-base text-muted-foreground dark:text-slate-400 leading-relaxed">
          Please read these Terms of Service carefully before using the NexMart platform
          operated by NexMart (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;).
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
          Questions about these terms?{" "}
          <a href="mailto:hello@nexmart.com" className="underline underline-offset-4 hover:text-foreground dark:hover:text-white transition-colors">
            hello@nexmart.com
          </a>
        </p>
        <div className="flex gap-4 mt-4">
          <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground dark:hover:text-white underline underline-offset-4 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground dark:hover:text-white underline underline-offset-4 transition-colors">
            FAQ
          </Link>
        </div>
      </div>
    </div>
  );
}
