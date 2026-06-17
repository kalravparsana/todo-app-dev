import { Link } from 'react-router-dom';
import { MarketingShell } from '@/components/MarketingShell';
import heroDawn from '@/assets/illustrations/hero-dawn.svg';
import arrowIcon from '@/assets/icons/icon-arrow.svg';

const features = [
  {
    title: 'Commit, don\'t collect',
    body: 'Today is a choice — not every due task, just what you\'re actually finishing. Meridian separates scheduling from commitment so your list stays calm.',
  },
  {
    title: 'Capture without friction',
    body: 'Drop thoughts into Inbox, then sort into projects when you have a moment. No natural-language parser required — just a fast field that respects your flow.',
  },
  {
    title: 'Gentle accountability',
    body: 'Missed a deadline? It waits quietly. No angry red guilt-trips — reschedule when you\'re ready and keep opening the app.',
  },
];

const workflow = [
  { step: '01', label: 'Capture', detail: 'Brain dump into Inbox — titles only, no ceremony.' },
  { step: '02', label: 'Sort', detail: 'Assign projects, set due dates, schedule for later.' },
  { step: '03', label: 'Commit', detail: 'Pull today\'s real workload onto the Commit Rail.' },
  { step: '04', label: 'Close', detail: 'Finish what you chose. Everything else can wait.' },
];

export function LandingPage() {
  return (
    <MarketingShell>
      {/* Hero — full-bleed asymmetric */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Task management, re-centered
            </p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.08] tracking-tight text-foreground text-balance lg:text-[64px]">
              Draw the line on what matters today
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Meridian is a calm daily task manager for people who open their list before email — and need it to feel inviting, not accusatory.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/app/today"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
              >
                Start your day
                <img src={arrowIcon} alt="" aria-hidden="true" className="h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-muted"
              >
                See how it works
              </a>
            </div>
          </div>
          <div className="relative">
            <img
              src={heroDawn}
              alt=""
              aria-hidden="true"
              className="w-full max-w-[480px] rounded-2xl shadow-lift lg:ml-auto"
            />
          </div>
        </div>
      </section>

      {/* Features — alternating layout */}
      <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground">
            Built for mornings, not meetings
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            We studied Things 3's calm restraint and Todoist's capture speed — then stripped everything that makes a task list feel like a report card.
          </p>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {features.map((f) => (
            <article
              key={f.title}
              className="rounded-2xl border border-border bg-surface p-6 shadow-card"
            >
              <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
                {f.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Workflow — full-bleed band */}
      <section
        id="how-it-works"
        className="border-y border-border bg-muted/50"
      >
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground">
            Four moves, every day
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {workflow.map((w) => (
              <div key={w.step} className="relative pl-1">
                <span className="font-display text-4xl font-semibold text-primary/20">
                  {w.step}
                </span>
                <h3 className="mt-2 font-display text-lg font-semibold text-foreground">
                  {w.label}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {w.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center lg:px-8">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground text-balance">
          Your list should invite you back tomorrow
        </h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Open Meridian, commit to three real tasks, and close the laptop knowing what done looks like.
        </p>
        <Link
          to="/app/today"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
        >
          Open Meridian
          <img src={arrowIcon} alt="" aria-hidden="true" className="h-4 w-4" />
        </Link>
      </section>
    </MarketingShell>
  );
}
