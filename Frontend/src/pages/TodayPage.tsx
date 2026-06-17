import { CommitRail } from '@/components/CommitRail';
import { QuickAdd } from '@/components/QuickAdd';
import { TaskList } from '@/components/TaskList';
import { EmptyState } from '@/components/EmptyState';
import { useTodos } from '@/hooks/useTodos';
import { getTodayString } from '@/lib/todoStore';
import emptyToday from '@/assets/illustrations/empty-today.svg';

export function TodayPage() {
  const { tasks, addTask } = useTodos();
  const today = getTodayString();

  const todayTasks = tasks.filter(
    (t) => t.committedToToday || (t.scheduledDate === today && !t.committedToToday),
  );

  const committedTasks = todayTasks.filter((t) => t.committedToToday);
  const scheduledOnly = todayTasks.filter((t) => !t.committedToToday && t.scheduledDate === today);

  const handleAdd = (title: string) => {
    addTask({
      title,
      committedToToday: true,
      scheduledDate: today,
    });
  };

  const weekday = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
      <header className="mb-8">
        <p className="text-sm font-medium text-today">{weekday}</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-foreground">
          Today
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          What you&apos;re choosing to finish — not everything that&apos;s due.
        </p>
      </header>

      <CommitRail />

      <div className="mt-8">
        <QuickAdd
          placeholder="Commit something for today…"
          onAdd={handleAdd}
        />
      </div>

      <section className="mt-8" aria-labelledby="committed-heading">
        <h2
          id="committed-heading"
          className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Committed ({committedTasks.filter((t) => !t.completed).length} active)
        </h2>
        <TaskList
          tasks={committedTasks}
          showTodayToggle
          empty={
            <EmptyState
              illustration={emptyToday}
              title="Nothing committed yet"
              description="Pick what you'll actually finish — not everything due, just what you're choosing today."
            />
          }
        />
      </section>

      {scheduledOnly.length > 0 && (
        <section className="mt-10" aria-labelledby="scheduled-heading">
          <h2
            id="scheduled-heading"
            className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Scheduled for today — not yet committed
          </h2>
          <TaskList tasks={scheduledOnly} showTodayToggle />
        </section>
      )}
    </div>
  );
}
