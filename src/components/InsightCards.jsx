function InsightCards({ insights }) {
  if (!insights?.length) return null;

  return (
    <div className="mt-8 grid gap-6 md:grid-cols-3">
      {insights.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-white/10 bg-white/5 p-4"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-teal-200">
            {card.label}
          </p>
          <p className="mt-2 text-lg font-semibold text-white">{card.value}</p>
        </div>
      ))}
    </div>
  );
}

export default InsightCards;
