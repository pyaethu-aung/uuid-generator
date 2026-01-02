function FeedbackBanner({ message }) {
  if (!message) return null;

  return (
    <p className="mx-auto max-w-md text-sm font-medium text-teal-200">
      {message}
    </p>
  );
}

function Hero({ feedback }) {
  return (
    <header className="space-y-6 text-center">
      <span className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-teal-100">
        Fresh IDs
      </span>
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold text-white drop-shadow-sm sm:text-5xl">
          Instant UUID generator built for flow
        </h1>
        <p className="mx-auto max-w-2xl text-balance text-base text-slate-200 sm:text-lg">
          Generate high-entropy RFC 4122 identifiers, format them for your
          stack, and copy or download entire batches without touching a
          terminal.
        </p>
      </div>
      <FeedbackBanner message={feedback} />
    </header>
  );
}

export default Hero;
