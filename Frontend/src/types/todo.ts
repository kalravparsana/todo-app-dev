export type TaskPriority = 'none' | 'high' | 'medium' | 'low';

export type Task = {
  id: string;
  title: string;
  notes?: string;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  dueDate?: string;
  scheduledDate?: string;
  projectId?: string;
  committedToToday: boolean;
  priority: TaskPriority;
};

export type Project = {
  id: string;
  name: string;
  color: string;
  createdAt: string;
};

export type TodoFilter = 'all' | 'active' | 'completed';

export type AppState = {
  tasks: Task[];
  projects: Project[];
};
