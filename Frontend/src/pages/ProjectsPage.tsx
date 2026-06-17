import { useState, type FormEvent } from 'react';
import { ProjectCard } from '@/components/ProjectCard';
import { EmptyState } from '@/components/EmptyState';
import { useTodos } from '@/hooks/useTodos';
import { PROJECT_COLORS } from '@/lib/todoStore';
import emptyProjects from '@/assets/illustrations/empty-projects.svg';

export function ProjectsPage() {
  const { projects, addProject } = useTodos();
  const [name, setName] = useState('');
  const [color, setColor] = useState(PROJECT_COLORS[0]);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addProject(name, color);
    setName('');
    setColor(PROJECT_COLORS[Math.floor(Math.random() * PROJECT_COLORS.length)]);
    setShowForm(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
            Projects
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Finite goals with a home — Northwind rebrand, not &quot;Misc.&quot;
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
        >
          {showForm ? 'Cancel' : 'New project'}
        </button>
      </header>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-2xl border border-border bg-surface p-5 shadow-card"
        >
          <label htmlFor="project-name" className="block text-sm font-medium text-foreground">
            Project name
          </label>
          <input
            id="project-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Q3 portfolio refresh"
            className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-[15px] focus:border-primary/40 focus:outline-none"
            autoFocus
          />
          <fieldset className="mt-4">
            <legend className="text-sm font-medium text-foreground">Color</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {PROJECT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  aria-label={`Select color ${c}`}
                  className={`h-8 w-8 rounded-full transition-transform duration-200 hover:scale-110 ${
                    color === c ? 'ring-2 ring-ring ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </fieldset>
          <button
            type="submit"
            disabled={!name.trim()}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Create project
          </button>
        </form>
      )}

      {projects.length === 0 ? (
        <EmptyState
          illustration={emptyProjects}
          title="No projects yet"
          description="Group related tasks under a project — like a client engagement or a home renovation."
          action={
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
            >
              Create your first project
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
