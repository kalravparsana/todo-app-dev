import type { Task } from '@/types/todo';
import { Icon } from '@/components/Icon';
import statusComplete from '@/assets/icons/status-complete.svg';
import statusIncomplete from '@/assets/icons/status-incomplete.svg';
import { formatDisplayDate } from '@/lib/todoStore';

type TaskItemProps = {
  task: Task;
  projectName?: string;
  projectColor?: string;
  onToggle: () => void;
  onToggleToday?: () => void;
  onDelete?: () => void;
  showTodayToggle?: boolean;
};

export function TaskItem({
  task,
  projectName,
  projectColor,
  onToggle,
  onToggleToday,
  onDelete,
  showTodayToggle = false,
}: TaskItemProps) {
  const isOverdue =
    !task.completed &&
    task.dueDate &&
    task.dueDate < new Date().toISOString().split('T')[0];

  return (
    <div
      className={`group flex items-start gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-colors duration-200 hover:border-border hover:bg-muted/50 ${
        task.completed ? 'opacity-60' : ''
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-label={task.completed ? `Mark "${task.title}" incomplete` : `Complete "${task.title}"`}
        className="mt-0.5 shrink-0 rounded-full transition-transform duration-200 hover:scale-105 active:scale-95"
      >
        <Icon
          src={task.completed ? statusComplete : statusIncomplete}
          className={`h-[18px] w-[18px] ${task.completed ? 'text-primary' : 'text-muted-foreground'}`}
        />
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`text-[15px] leading-snug ${
            task.completed ? 'text-muted-foreground line-through' : 'text-foreground'
          }`}
        >
          {task.title}
        </p>

        {(projectName || task.dueDate || task.scheduledDate || task.notes) && (
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {projectName && projectColor && (
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: projectColor }}
                  aria-hidden="true"
                />
                {projectName}
              </span>
            )}
            {task.scheduledDate && (
              <span className={task.committedToToday ? 'font-medium text-today' : ''}>
                {formatDisplayDate(task.scheduledDate)}
              </span>
            )}
            {task.dueDate && (
              <span className={isOverdue ? 'font-medium text-warning' : ''}>
                Due {formatDisplayDate(task.dueDate)}
              </span>
            )}
            {task.priority === 'high' && !task.completed && (
              <span className="font-medium text-warning">High</span>
            )}
          </div>
        )}

        {task.notes && !task.completed && (
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
            {task.notes}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
        {showTodayToggle && onToggleToday && !task.completed && (
          <button
            type="button"
            onClick={onToggleToday}
            className={`rounded-lg px-2 py-1 text-xs font-medium transition-colors duration-200 ${
              task.committedToToday
                ? 'bg-today/15 text-today'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {task.committedToToday ? 'Committed' : 'Commit'}
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg px-2 py-1 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:bg-destructive/10 hover:text-destructive"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
