import type { Project } from '@/types/todo';
import { Link } from 'react-router-dom';
import { useTodos } from '@/hooks/useTodos';

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const { tasks } = useTodos();
  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const active = projectTasks.filter((t) => !t.completed).length;
  const done = projectTasks.filter((t) => t.completed).length;

  return (
    <Link
      to={`/app/projects/${project.id}`}
      className="group block rounded-2xl border border-border bg-surface p-5 shadow-card transition-all duration-200 hover:border-primary/25 hover:shadow-lift"
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-1 h-3 w-3 shrink-0 rounded-full"
          style={{ backgroundColor: project.color }}
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-semibold tracking-tight text-foreground group-hover:text-primary">
            {project.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {active === 0 && done === 0
              ? 'No tasks yet'
              : `${active} active · ${done} done`}
          </p>
        </div>
      </div>
    </Link>
  );
}
