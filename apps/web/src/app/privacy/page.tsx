import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-sm font-bold tracking-tight text-foreground">
            IELTS Accelerator
          </Link>
          <Link href="/login" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Sign in
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-bold text-foreground">Privacy Policy</h1>
        <p className="mt-1 text-sm text-muted-foreground">Last updated: May 2026</p>

        <div className="mt-10 flex flex-col gap-10 text-sm leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-base font-semibold text-foreground mb-3">1. Who we are</h2>
            <p>
              IELTS Accelerator is a personal study tool built for Vietnamese software engineers preparing for IELTS.
              It is operated by an individual developer, not a registered company.
              If you have questions, contact us at the email address shown at the bottom of this page.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-3">2. What data we collect</h2>
            <ul className="flex flex-col gap-2 list-disc list-inside">
              <li><span className="font-medium text-foreground">Account information</span> — your email address and name, obtained via Google Sign-In when you create an account.</li>
              <li><span className="font-medium text-foreground">Practice content</span> — essays you submit, speaking transcripts, reading and listening answers, vocabulary and collocations you save.</li>
              <li><span className="font-medium text-foreground">Usage data</span> — which features you use, when you last used the app, and your band score history.</li>
              <li><span className="font-medium text-foreground">Feedback and mistakes</span> — any text you enter in the Wrong Decision Log or other journaling features.</li>
            </ul>
            <p className="mt-3">We do not collect payment information, billing addresses, or financial data at this time.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-3">3. How we use your data</h2>
            <ul className="flex flex-col gap-2 list-disc list-inside">
              <li>To provide AI-generated feedback on your writing and speaking sessions.</li>
              <li>To track your band score progress over time and show it in the Analytics page.</li>
              <li>To personalise your vocabulary library, saved collocations, and study plan.</li>
              <li>To show you which features you have used and remind you to return if you become inactive.</li>
            </ul>
            <p className="mt-3">
              Your submitted essays and speaking transcripts are sent to the Anthropic API (Claude) to generate feedback.
              Anthropic&apos;s privacy policy applies to that processing.
              We do not use your content to train AI models.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-3">4. Who we share data with</h2>
            <p>We do not sell or rent your data. We share it only with the services required to run the app:</p>
            <ul className="mt-3 flex flex-col gap-2 list-disc list-inside">
              <li><span className="font-medium text-foreground">Anthropic</span> — AI feedback generation (Claude API).</li>
              <li><span className="font-medium text-foreground">Neon / PostgreSQL</span> — database hosting for your account and practice history.</li>
              <li><span className="font-medium text-foreground">Vercel</span> — application hosting and server-side rendering.</li>
              <li><span className="font-medium text-foreground">Google</span> — authentication only (Google Sign-In). We receive your email and name; we do not access your Google Drive, Gmail, or other Google services.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-3">5. Data retention</h2>
            <p>
              Your data is retained as long as your account is active.
              If you request account deletion, we will remove your personal data and practice history within 14 days.
              Anonymised, aggregated usage statistics (no personally identifiable information) may be retained for product improvement.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-3">6. Your rights</h2>
            <p>You have the right to:</p>
            <ul className="mt-3 flex flex-col gap-2 list-disc list-inside">
              <li>Request a copy of the data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your account and all associated data.</li>
              <li>Withdraw consent at any time by deleting your account.</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, contact us at the email address below.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-3">7. Cookies and local storage</h2>
            <p>
              We use browser cookies only for authentication (to keep you signed in via NextAuth).
              We use <code className="rounded bg-muted px-1 py-0.5 text-xs text-foreground">localStorage</code> to remember your UI preferences
              (sidebar state, font size, dismissed onboarding tour).
              We do not use tracking cookies or third-party advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-3">8. Security</h2>
            <p>
              All data is transmitted over HTTPS.
              Passwords (for admin accounts) are hashed with bcrypt before storage.
              Google Sign-In users have no password stored on our servers.
              We follow standard security practices for a small-scale web application.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-3">9. Changes to this policy</h2>
            <p>
              We may update this policy as the product evolves. If changes are material, we will notify active users
              via the application. The date at the top of this page reflects the most recent update.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-3">10. Contact</h2>
            <p>
              For any privacy-related questions or data requests, please reach out via the Zalo number or
              email address shared during your beta onboarding. We respond within 2 business days.
            </p>
          </section>

        </div>
      </main>

      <footer className="border-t border-border mt-16">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6 text-xs text-faint">
          <span>IELTS Accelerator</span>
          <Link href="/" className="hover:text-muted-foreground transition-colors">Back to home</Link>
        </div>
      </footer>
    </div>
  )
}
