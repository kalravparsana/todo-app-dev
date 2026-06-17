import type { AppState, Project, Task, TaskPriority } from '@/types/todo';

const STORAGE_KEY = 'meridian-todo-state-v1';

const SEED_PROJECTS: Project[] = [
  { id: 'proj-studio', name: 'Northwind rebrand', color: '#2D6A4F', createdAt: '2026-05-12T09:00:00.000Z' },
  { id: 'proj-home', name: 'Apartment reset', color: '#C87941', createdAt: '2026-05-18T14:30:00.000Z' },
  { id: 'proj-writing', name: 'Newsletter — Issue 14', color: '#5B6EAE', createdAt: '2026-06-02T11:15:00.000Z' },
];

const today = new Date();
const formatDate = (offsetDays: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

const SEED_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Send revised logo lockups to Priya',
    notes: 'Include dark-mode variants and the 32px favicon export.',
    completed: false,
    createdAt: '2026-06-14T08:22:00.000Z',
    dueDate: formatDate(0),
    scheduledDate: formatDate(0),
    projectId: 'proj-studio',
    committedToToday: true,
    priority: 'high',
  },
  {
    id: 'task-2',
    title: 'Outline Q3 content calendar',
    completed: false,
    createdAt: '2026-06-13T16:45:00.000Z',
    scheduledDate: formatDate(0),
    projectId: 'proj-writing',
    committedToToday: true,
    priority: 'medium',
  },
  {
    id: 'task-3',
    title: 'Book HVAC inspection for Thursday',
    completed: false,
    createdAt: '2026-06-12T10:10:00.000Z',
    dueDate: formatDate(2),
    projectId: 'proj-home',
    committedToToday: false,
    priority: 'medium',
  },
  {
    id: 'task-4',
    title: 'Review contractor quote for kitchen shelves',
    completed: true,
    completedAt: '2026-06-11T19:30:00.000Z',
    createdAt: '2026-06-09T13:00:00.000Z',
    projectId: 'proj-home',
    committedToToday: false,
    priority: 'low',
  },
  {
    id: 'task-5',
    title: 'Draft intro paragraph for Issue 14',
    completed: false,
    createdAt: '2026-06-15T07:55:00.000Z',
    scheduledDate: formatDate(1),
    projectId: 'proj-writing',
    committedToToday: false,
    priority: 'none',
  },
  {
    id: 'task-6',
    title: 'Pick up prescription — Walgreens on 4th',
    completed: false,
    createdAt: '2026-06-15T09:12:00.000Z',
    dueDate: formatDate(0),
    committedToToday: false,
    priority: 'high',
  },
  {
    id: 'task-7',
    title: 'Research competitor onboarding flows',
    notes: 'Focus on empty states and first-run capture.',
    completed: false,
    createdAt: '2026-06-14T11:30:00.000Z',
    projectId: 'proj-studio',
    committedToToday: false,
    priority: 'low',
  },
];

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as AppState;
    }
  } catch {
    // fall through to seed
  }
  return { tasks: SEED_TASKS, projects: SEED_PROJECTS };
}

function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function createId() {
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

export function formatDisplayDate(isoDate: string) {
  const date = new Date(`${isoDate}T12:00:00`);
  const todayStr = getTodayString();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  if (isoDate === todayStr) return 'Today';
  if (isoDate === tomorrowStr) return 'Tomorrow';

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export const todoStore = {
  load: loadState,
  save: saveState,

  addTask(
    state: AppState,
    input: {
      title: string;
      projectId?: string;
      dueDate?: string;
      scheduledDate?: string;
      committedToToday?: boolean;
      priority?: TaskPriority;
    },
  ): AppState {
    const task: Task = {
      id: createId(),
      title: input.title.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      projectId: input.projectId,
      dueDate: input.dueDate,
      scheduledDate: input.scheduledDate,
      committedToToday: input.committedToToday ?? false,
      priority: input.priority ?? 'none',
    };
    return { ...state, tasks: [task, ...state.tasks] };
  },

  toggleComplete(state: AppState, taskId: string): AppState {
    return {
      ...state,
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? new Date().toISOString() : undefined,
            }
          : t,
      ),
    };
  },

  toggleTodayCommit(state: AppState, taskId: string): AppState {
    return {
      ...state,
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, committedToToday: !t.committedToToday } : t,
      ),
    };
  },

  updateTask(state: AppState, taskId: string, updates: Partial<Task>): AppState {
    return {
      ...state,
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
    };
  },

  deleteTask(state: AppState, taskId: string): AppState {
    return { ...state, tasks: state.tasks.filter((t) => t.id !== taskId) };
  },

  addProject(state: AppState, name: string, color: string): AppState {
    const project: Project = {
      id: createId(),
      name: name.trim(),
      color,
      createdAt: new Date().toISOString(),
    };
    return { ...state, projects: [...state.projects, project] };
  },

  deleteProject(state: AppState, projectId: string): AppState {
    return {
      ...state,
      projects: state.projects.filter((p) => p.id !== projectId),
      tasks: state.tasks.map((t) =>
        t.projectId === projectId ? { ...t, projectId: undefined } : t,
      ),
    };
  },
};

export const PROJECT_COLORS = [
  '#2D6A4F',
  '#C87941',
  '#5B6EAE',
  '#9B4D6A',
  '#4A7C6F',
  '#7C6B4A',
];
