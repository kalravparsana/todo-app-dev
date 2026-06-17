import type { Task, Project } from '../types/todo.js';
import { query } from '../db/pool.js';

type TaskRow = {
  id: string;
  title: string;
  notes: string | null;
  completed: boolean;
  completed_at: Date | null;
  created_at: Date;
  due_date: string | null;
  scheduled_date: string | null;
  project_id: string | null;
  committed_to_today: boolean;
  priority: string;
};

type ProjectRow = {
  id: string;
  name: string;
  color: string;
  created_at: Date;
};

function rowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    notes: row.notes ?? undefined,
    completed: row.completed,
    completedAt: row.completed_at?.toISOString(),
    createdAt: row.created_at.toISOString(),
    dueDate: row.due_date ?? undefined,
    scheduledDate: row.scheduled_date ?? undefined,
    projectId: row.project_id ?? undefined,
    committedToToday: row.committed_to_today,
    priority: row.priority as Task['priority'],
  };
}

function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    createdAt: row.created_at.toISOString(),
  };
}

export async function listTasks(): Promise<Task[]> {
  const result = await query<TaskRow>(
    `SELECT * FROM tasks ORDER BY created_at DESC`,
  );
  return result.rows.map(rowToTask);
}

export async function createTask(input: {
  id: string;
  title: string;
  notes?: string;
  dueDate?: string;
  scheduledDate?: string;
  projectId?: string;
  committedToToday?: boolean;
  priority?: string;
}): Promise<Task> {
  const now = new Date();
  const result = await query<TaskRow>(
    `INSERT INTO tasks (
      id, title, notes, completed, created_at, due_date, scheduled_date,
      project_id, committed_to_today, priority
    ) VALUES ($1,$2,$3,false,$4,$5,$6,$7,$8,$9)
    RETURNING *`,
    [
      input.id,
      input.title,
      input.notes ?? null,
      now,
      input.dueDate ?? null,
      input.scheduledDate ?? null,
      input.projectId ?? null,
      input.committedToToday ?? false,
      input.priority ?? 'none',
    ],
  );
  return rowToTask(result.rows[0]);
}

export async function updateTask(
  id: string,
  updates: Partial<{
    title: string;
    notes: string | null;
    completed: boolean;
    completedAt: string | null;
    dueDate: string | null;
    scheduledDate: string | null;
    projectId: string | null;
    committedToToday: boolean;
    priority: string;
  }>,
): Promise<Task | null> {
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  const mapping: Record<string, string> = {
    title: 'title',
    notes: 'notes',
    completed: 'completed',
    completedAt: 'completed_at',
    dueDate: 'due_date',
    scheduledDate: 'scheduled_date',
    projectId: 'project_id',
    committedToToday: 'committed_to_today',
    priority: 'priority',
  };

  for (const [key, column] of Object.entries(mapping)) {
    if (key in updates) {
      fields.push(`${column} = $${idx++}`);
      const value = updates[key as keyof typeof updates];
      values.push(value ?? null);
    }
  }

  if (fields.length === 0) {
    const existing = await query<TaskRow>(`SELECT * FROM tasks WHERE id = $1`, [id]);
    return existing.rows[0] ? rowToTask(existing.rows[0]) : null;
  }

  values.push(id);
  const result = await query<TaskRow>(
    `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
    values,
  );
  return result.rows[0] ? rowToTask(result.rows[0]) : null;
}

export async function deleteTask(id: string): Promise<boolean> {
  const result = await query(`DELETE FROM tasks WHERE id = $1`, [id]);
  return (result.rowCount ?? 0) > 0;
}

export async function listProjects(): Promise<Project[]> {
  const result = await query<ProjectRow>(
    `SELECT * FROM projects ORDER BY created_at ASC`,
  );
  return result.rows.map(rowToProject);
}

export async function createProject(input: {
  id: string;
  name: string;
  color: string;
}): Promise<Project> {
  const now = new Date();
  const result = await query<ProjectRow>(
    `INSERT INTO projects (id, name, color, created_at) VALUES ($1,$2,$3,$4) RETURNING *`,
    [input.id, input.name, input.color, now],
  );
  return rowToProject(result.rows[0]);
}

export async function deleteProject(id: string): Promise<boolean> {
  await query(`UPDATE tasks SET project_id = NULL WHERE project_id = $1`, [id]);
  const result = await query(`DELETE FROM projects WHERE id = $1`, [id]);
  return (result.rowCount ?? 0) > 0;
}
