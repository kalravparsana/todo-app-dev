import type { Task } from '@/types/todo';
import { TaskItem } from '@/components/TaskItem';
import { useTodos } from '@/hooks/useTodos';

type TaskListProps = {
  tasks: Task[];
  empty?: React.ReactNode;
  showTodayToggle?: boolean;
};

export function TaskList({ tasks, empty, showTodayToggle = false }: TaskListProps) {
  const { toggleComplete, toggleTodayCommit, deleteTask, getProjectById } = useTodos();

  if (tasks.length === 0 && empty) {
    return <>{empty}</>;
  }

  if (tasks.length === 0) {
    return (
      <p className="px-3 py-8 text-center text-sm text-muted-foreground">
        No tasks here.
      </p>
    );
  }

  const active = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

  return (
    <div className="space-y-1">
      {active.map((task) => {
        const project = task.projectId ? getProjectById(task.projectId) : undefined;
        return (
          <TaskItem
            key={task.id}
            task={task}
            projectName={project?.name}
            projectColor={project?.color}
            onToggle={() => toggleComplete(task.id)}
            onToggleToday={() => toggleTodayCommit(task.id)}
            onDelete={() => deleteTask(task.id)}
            showTodayToggle={showTodayToggle}
          />
        );
      })}

      {completed.length > 0 && (
        <div className="pt-4">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Completed ({completed.length})
          </p>
          {completed.map((task) => {
            const project = task.projectId ? getProjectById(task.projectId) : undefined;
            return (
              <TaskItem
                key={task.id}
                task={task}
                projectName={project?.name}
                projectColor={project?.color}
                onToggle={() => toggleComplete(task.id)}
                onDelete={() => deleteTask(task.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
