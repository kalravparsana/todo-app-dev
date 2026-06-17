import type { Project, Task, TaskPriority } from '@/types/todo';

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

export function isApiEnabled(): boolean {
  return Boolean(API_BASE);
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message =
      (body as { error?: { message?: string } })?.error?.message ??
      `Request failed (${response.status})`;
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const todoApi = {
  async fetchTasks(): Promise<Task[]> {
    return request<Task[]>('/api/tasks');
  },

  async fetchProjects(): Promise<Project[]> {
    return request<Project[]>('/api/projects');
  },

  async createTask(input: {
    title: string;
    projectId?: string;
    dueDate?: string;
    scheduledDate?: string;
    committedToToday?: boolean;
    priority?: TaskPriority;
  }): Promise<Task> {
    return request<Task>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    return request<Task>(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async deleteTask(taskId: string): Promise<void> {
    await request<void>(`/api/tasks/${taskId}`, { method: 'DELETE' });
  },

  async createProject(name: string, color: string): Promise<Project> {
    return request<Project>('/api/projects', {
      method: 'POST',
      body: JSON.stringify({ name, color }),
    });
  },

  async deleteProject(projectId: string): Promise<void> {
    await request<void>(`/api/projects/${projectId}`, { method: 'DELETE' });
  },
};
