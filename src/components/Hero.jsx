function FeedbackBanner({ message }) {
  if (!message) return null;

  return (
    <p className="mx-auto max-w-md text-sm font-medium theme-text-accent">
      {message}
    </p>
  );
}

// Note: FeedbackBanner is intentionally removed/replaced by inline success states if needed, 
// or can be re-integrated. For now, we focus on the new static layout per spec.
// If feedback prop is critical, we can render it below buttons.

function Hero({ feedback }) {
  const scrollToGenerator = () => {
    // Determine target based on layout. Since UuidList/ControlPanel are just below,
    // a small scroll or focus shift might be enough. 
    // For now, simpler is better.
    const controls = document.querySelector('section');
    if (controls) {
      controls.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section aria-label="Hero" className="relative overflow-hidden hero-bg py-16 sm:py-24 lg:py-32">
      <div className="relative z-10 mx-auto max-w-6xl px-4 text-center">
        <div className="space-y-8">
          {/* Badge */}
          <div className="flex justify-center">
            <span className="theme-badge inline-flex items-center rounded-full px-3 py-1 text-sm font-medium">
              FRESH IDS
            </span>
          </div>

          {/* Headlines */}
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight theme-text-primary sm:text-5xl lg:text-6xl">
              Generate UUIDs Instantly
            </h1>
            <p className="mx-auto max-w-2xl text-lg theme-text-secondary sm:text-xl">
              Fast, secure, and verifiable UUIDs v4, v7. Format them for your stack without touching a terminal.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">

            <a
              href="https://datatracker.ietf.org/doc/html/rfc4122"
              target="_blank"
              rel="noopener noreferrer"
              className="theme-ghost-button inline-flex h-12 items-center justify-center rounded-full px-8 text-base font-semibold transition hover:bg-white/5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--page-bg)]"
            >
              Learn More
              <svg
                className="ml-2 -mr-1 h-4 w-4 opacity-70"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>

          {/* Feedback message if any */}
          {feedback && (
            <p className="animate-fade-in text-sm font-medium theme-text-accent">
              {feedback}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Hero;
