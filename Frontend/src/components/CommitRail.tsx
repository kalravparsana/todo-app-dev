import { useTodos } from '@/hooks/useTodos';

export function CommitRail() {
  const { tasks } = useTodos();
  const committed = tasks.filter((t) => t.committedToToday && !t.completed);
  const done = tasks.filter((t) => t.committedToToday && t.completed);
  const total = committed.length + done.length;
  const progress = total === 0 ? 0 : done.length / total;

  const circumference = 2 * Math.PI * 42;
  const offset = circumference * (1 - progress);

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-card"
      aria-label="Today's commitment progress"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-today">
            Commit rail
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground">
            {total === 0
              ? 'Nothing committed yet'
              : `${done.length} of ${total} committed`}
          </h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            {total === 0
              ? "Pick what you'll actually finish — not everything due, just what you're choosing today."
              : done.length === total
                ? 'You closed the loop on every commitment. Reschedule or add more if the day opens up.'
                : `${committed.length} still on your line. One at a time.`}
          </p>
        </div>

        <div className="relative mx-auto h-28 w-28 shrink-0 sm:mx-0" aria-hidden="true">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="var(--muted)"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="var(--today)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-[stroke-dashoffset] duration-500 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-2xl font-semibold tabular-nums text-foreground">
              {total === 0 ? '—' : `${Math.round(progress * 100)}%`}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
