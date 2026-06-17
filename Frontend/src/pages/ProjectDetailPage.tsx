import { Link, useNavigate, useParams } from 'react-router-dom';
import { QuickAdd } from '@/components/QuickAdd';
import { TaskList } from '@/components/TaskList';
import { useTodos } from '@/hooks/useTodos';

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tasks, projects, addTask, deleteProject } = useTodos();

  const project = projects.find((p) => p.id === id);
  const projectTasks = tasks.filter((t) => t.projectId === id);

  if (!project) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center md:px-8">
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Project not found
        </h1>
        <Link
          to="/app/projects"
          className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
        >
          Back to projects
        </Link>
      </div>
    );
  }

  const handleAdd = (title: string) => {
    addTask({ title, projectId: project.id });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
      <Link
        to="/app/projects"
        className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
      >
        ← Projects
      </Link>

      <header className="mt-4 mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span
            className="mt-2 h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: project.color }}
            aria-hidden="true"
          />
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
              {project.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {projectTasks.filter((t) => !t.completed).length} active tasks
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Delete "${project.name}"? Tasks will move to Inbox.`)) {
              deleteProject(project.id);
              navigate('/app/projects');
            }
          }}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-destructive/10 hover:text-destructive"
        >
          Delete project
        </button>
      </header>

      <QuickAdd placeholder={`Add to ${project.name}…`} onAdd={handleAdd} />

      <section className="mt-8">
        <TaskList tasks={projectTasks} showTodayToggle />
      </section>
    </div>
  );
}
