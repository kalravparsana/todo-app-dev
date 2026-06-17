import { useMemo } from 'react';
import { TaskList } from '@/components/TaskList';
import { useTodos } from '@/hooks/useTodos';
import { formatDisplayDate, getTodayString } from '@/lib/todoStore';

export function UpcomingPage() {
  const { tasks } = useTodos();
  const today = getTodayString();

  const upcomingTasks = tasks.filter(
    (t) =>
      !t.completed &&
      ((t.scheduledDate && t.scheduledDate > today) ||
        (t.dueDate && t.dueDate > today)),
  );

  const grouped = useMemo(() => {
    const groups = new Map<string, typeof upcomingTasks>();
    for (const task of upcomingTasks) {
      const date = task.scheduledDate || task.dueDate || '';
      const existing = groups.get(date) ?? [];
      existing.push(task);
      groups.set(date, existing);
    }
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [upcomingTasks]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
          Upcoming
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          What&apos;s on the horizon — commit when the day arrives.
        </p>
      </header>

      {grouped.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface px-6 py-14 text-center shadow-card">
          <p className="font-display text-xl font-semibold tracking-tight text-foreground">
            The horizon is clear
          </p>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Schedule tasks for later from Inbox or a project — they&apos;ll line up here by day, ready to commit when the morning comes.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {grouped.map(([date, dateTasks]) => (
            <section key={date} aria-labelledby={`date-${date}`}>
              <h2
                id={`date-${date}`}
                className="mb-3 px-3 font-display text-lg font-semibold tracking-tight text-foreground"
              >
                {formatDisplayDate(date)}
              </h2>
              <TaskList tasks={dateTasks} showTodayToggle />
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
