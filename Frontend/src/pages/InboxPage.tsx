import { QuickAdd } from '@/components/QuickAdd';
import { TaskList } from '@/components/TaskList';
import { EmptyState } from '@/components/EmptyState';
import { useTodos } from '@/hooks/useTodos';
import emptyInbox from '@/assets/illustrations/empty-inbox.svg';

export function InboxPage() {
  const { tasks, addTask } = useTodos();

  const inboxTasks = tasks.filter(
    (t) => !t.projectId && !t.committedToToday && !t.scheduledDate,
  );

  const handleAdd = (title: string) => {
    addTask({ title });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
          Inbox
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Capture first — sort into projects and dates when you have a breath.
        </p>
      </header>

      <QuickAdd
        placeholder="Capture a thought…"
        onAdd={handleAdd}
        autoFocus
      />

      <section className="mt-8">
        <TaskList
          tasks={inboxTasks}
          showTodayToggle
          empty={
            <EmptyState
              illustration={emptyInbox}
              title="Inbox is clear"
              description="When something pops up, drop it here. You'll triage it into a project or schedule later."
            />
          }
        />
      </section>
    </div>
  );
}
