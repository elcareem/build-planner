import Link from 'next/link';

const FEATURES = [
  {
    icon: '✦',
    title: 'Guided questionnaire',
    description:
      'A focused, step-by-step flow — not a long form. Answer 5 short questions in under 3 minutes.',
  },
  {
    icon: '◈',
    title: 'Complete business plan',
    description:
      'Executive summary, market analysis, competitive landscape, SWOT, marketing strategy, and more.',
  },
  {
    icon: '⬡',
    title: 'Export to PDF',
    description:
      'Download a clean, professional PDF ready to share with banks, investors, or grant reviewers.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      {/* Nav */}
      <nav className="border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-sm font-semibold text-[var(--color-heading)]">
            Build<span className="text-[var(--color-teal)]">Planner</span>
          </span>
          <Link
            href="/plan"
            className="rounded-lg bg-[var(--color-teal)] px-4 py-2 text-xs font-medium text-white hover:bg-[var(--color-teal-hover)] transition-colors"
          >
            Get started →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs font-medium text-[var(--color-teal)] mb-8">
          AI-powered Business Plan· Free to try
        </span>

        <h1 className="text-4xl sm:text-5xl font-bold text-[var(--color-heading)] leading-tight tracking-tight max-w-xl mb-5">
          Your business plan,{' '}
          <span className="text-[var(--color-teal)]">generated in minutes</span>
        </h1>

        <p className="text-[var(--color-muted)] text-base sm:text-lg leading-relaxed max-w-md mb-10">
          Answer a short questionnaire and get a complete, structured business plan — ready to
          share with banks, investors, or grant reviewers.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/plan"
            className="rounded-lg bg-[var(--color-teal)] px-7 py-3 text-sm font-medium text-white hover:bg-[var(--color-teal-hover)] transition-colors w-full sm:w-auto text-center"
          >
            Build my plan →
          </Link>
          <Link
            href="/plan?preview=1"
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-7 py-3 text-sm font-medium text-[var(--color-heading)] hover:border-[var(--color-teal)]/40 transition-colors w-full sm:w-auto text-center"
          >
            See a sample plan
          </Link>
        </div>

        {/* Social proof strip */}
        <p className="mt-7 text-xs text-[var(--color-muted)]">
          No account required · Takes about 3 minutes · Export to PDF
        </p>
      </main>

      {/* Features */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-muted)] text-center mb-10">
            What you get
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-6 py-6"
              >
                <span className="text-[var(--color-teal)] text-lg mb-3 block">{f.icon}</span>
                <h3 className="text-sm font-semibold text-[var(--color-heading)] mb-1.5">
                  {f.title}
                </h3>
                <p className="text-xs text-[var(--color-muted)] leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)]">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-center">
          <span className="text-xs text-[var(--color-muted)]">
            Build<span className="text-[var(--color-teal)] font-medium">Planner</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
