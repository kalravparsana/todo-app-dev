import type { Page, Route } from '@playwright/test';

export const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
export const STORAGE_KEY = 'meridian-todo-state-v1';

const formatDate = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const getTodayString = (): string => new Date().toISOString().split('T')[0];

const seedProjects = [
  {
    id: 'proj-studio',
    name: 'Northwind rebrand',
    color: '#2D6A4F',
    createdAt: '2026-05-12T09:00:00.000Z',
  },
  {
    id: 'proj-home',
    name: 'Apartment reset',
    color: '#C87941',
    createdAt: '2026-05-18T14:30:00.000Z',
  },
  {
    id: 'proj-writing',
    name: 'Newsletter — Issue 14',
    color: '#5B6EAE',
    createdAt: '2026-06-02T11:15:00.000Z',
  },
] as const;

const seedTasks = [
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
    priority: 'high' as const,
  },
  {
    id: 'task-2',
    title: 'Outline Q3 content calendar',
    completed: false,
    createdAt: '2026-06-13T16:45:00.000Z',
    scheduledDate: formatDate(0),
    projectId: 'proj-writing',
    committedToToday: true,
    priority: 'medium' as const,
  },
  {
    id: 'task-3',
    title: 'Book HVAC inspection for Thursday',
    completed: false,
    createdAt: '2026-06-12T10:10:00.000Z',
    dueDate: formatDate(2),
    projectId: 'proj-home',
    committedToToday: false,
    priority: 'medium' as const,
  },
  {
    id: 'task-4',
    title: 'Review contractor quote for kitchen shelves',
    completed: true,
    completedAt: '2026-06-11T19:30:00.000Z',
    createdAt: '2026-06-09T13:00:00.000Z',
    projectId: 'proj-home',
    committedToToday: false,
    priority: 'low' as const,
  },
  {
    id: 'task-5',
    title: 'Draft intro paragraph for Issue 14',
    completed: false,
    createdAt: '2026-06-15T07:55:00.000Z',
    scheduledDate: formatDate(1),
    projectId: 'proj-writing',
    committedToToday: false,
    priority: 'none' as const,
  },
  {
    id: 'task-6',
    title: 'Pick up prescription — Walgreens on 4th',
    completed: false,
    createdAt: '2026-06-15T09:12:00.000Z',
    dueDate: formatDate(0),
    committedToToday: false,
    priority: 'high' as const,
  },
  {
    id: 'task-7',
    title: 'Research competitor onboarding flows',
    notes: 'Focus on empty states and first-run capture.',
    completed: false,
    createdAt: '2026-06-14T11:30:00.000Z',
    projectId: 'proj-studio',
    committedToToday: false,
    priority: 'low' as const,
  },
] as const;

export const meridianTodoData = {
  routes: {
    landing: '/',
    today: '/app/today',
    inbox: '/app/inbox',
    upcoming: '/app/upcoming',
    projects: '/app/projects',
    projectDetail: (id: string) => `/app/projects/${id}`,
    seedProjectId: 'proj-studio',
  },
  projects: {
    studio: seedProjects[0],
    home: seedProjects[1],
    writing: seedProjects[2],
    all: [...seedProjects],
  },
  tasks: {
    logoLockups: seedTasks[0],
    contentCalendar: seedTasks[1],
    hvacInspection: seedTasks[2],
    contractorQuote: seedTasks[3],
    introParagraph: seedTasks[4],
    prescription: seedTasks[5],
    competitorResearch: seedTasks[6],
    all: [...seedTasks],
  },
  valid: {
    taskTitle: 'Review sprint board before standup',
    inboxTaskTitle: 'Call dentist about appointment',
    projectName: 'Q3 portfolio refresh',
    projectColor: '#2D6A4F',
    todayQuickAddPlaceholder: 'Commit something for today…',
    inboxQuickAddPlaceholder: 'Capture a thought…',
    projectQuickAddPlaceholder: 'Add to Northwind rebrand…',
  },
  invalid: {
    emptyTitle: '',
    whitespaceTitle: '   ',
    emptyProjectName: '',
    whitespaceProjectName: '  ',
  },
  edge: {
    longTaskTitle: 'A'.repeat(500),
    unicodeTaskTitle: 'Acme & Co. — 日本語タスク',
    xssLikeTitle: '<script>alert(1)</script>',
    longProjectName: 'B'.repeat(200),
    specialProjectName: 'Client / Q3 — "Phase 2"',
    searchLikeTitle: '!@#$%^&*()',
  },
  api: {
    tasksSuccess: [...seedTasks],
    projectsSuccess: [...seedProjects],
    tasksEmpty: [] as typeof seedTasks,
    projectsEmpty: [] as typeof seedProjects,
    errorMessage: 'Request failed',
    serverErrorMessage: 'Internal server error',
    notFoundMessage: 'Not found',
  },
  copy: {
    landingHeadline: 'Draw the line on what matters today',
    todayHeading: 'Today',
    inboxHeading: 'Inbox',
    upcomingHeading: 'Upcoming',
    projectsHeading: 'Projects',
    commitRailLabel: "Today's commitment progress",
    inboxEmptyTitle: 'Inbox is clear',
    upcomingEmptyTitle: 'The horizon is clear',
    projectNotFound: 'Project not found',
    studioProjectName: 'Northwind rebrand',
  },
} as const;

export async function clearAppStorage(page: Page): Promise<void> {
  await page.addInitScript((key: string) => {
    localStorage.removeItem(key);
  }, STORAGE_KEY);
}

type ApiMockOptions = {
  tasks?: readonly (typeof seedTasks)[number][];
  projects?: readonly (typeof seedProjects)[number][];
  tasksGetStatus?: number;
  projectsGetStatus?: number;
  tasksPostStatus?: number;
  projectsPostStatus?: number;
  tasksPatchStatus?: number;
  tasksDeleteStatus?: number;
  projectsDeleteStatus?: number;
  delayMs?: number;
  abortTasks?: boolean;
  abortProjects?: boolean;
};

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function errorBody(message: string): string {
  return JSON.stringify({ error: { message } });
}

export async function mockMeridianApi(
  page: Page,
  options: ApiMockOptions = {},
): Promise<void> {
  const tasks = options.tasks ?? meridianTodoData.api.tasksSuccess;
  const projects = options.projects ?? meridianTodoData.api.projectsSuccess;

  const handleTasks = async (route: Route): Promise<void> => {
    if (options.abortTasks) {
      await route.abort('failed');
      return;
    }
    if (options.delayMs) {
      await delay(options.delayMs);
    }

    const method = route.request().method();
    const url = route.request().url();

    if (method === 'GET' && url.endsWith('/api/tasks')) {
      const status = options.tasksGetStatus ?? 200;
      await route.fulfill({
        status,
        contentType: 'application/json',
        body:
          status >= 400
            ? errorBody(meridianTodoData.api.errorMessage)
            : JSON.stringify(tasks),
      });
      return;
    }

    if (method === 'POST' && url.endsWith('/api/tasks')) {
      const status = options.tasksPostStatus ?? 201;
      const body = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({
        status,
        contentType: 'application/json',
        body:
          status >= 400
            ? errorBody(meridianTodoData.api.errorMessage)
            : JSON.stringify({
                id: 'task-mock-new',
                title: body.title,
                completed: false,
                createdAt: new Date().toISOString(),
                committedToToday: body.committedToToday ?? false,
                priority: body.priority ?? 'none',
                projectId: body.projectId,
                dueDate: body.dueDate,
                scheduledDate: body.scheduledDate,
              }),
      });
      return;
    }

    if (method === 'PATCH' && /\/api\/tasks\/[^/]+$/.test(url)) {
      const status = options.tasksPatchStatus ?? 200;
      const taskId = url.split('/').pop() ?? '';
      const existing = tasks.find((t) => t.id === taskId) ?? tasks[0];
      const updates = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({
        status,
        contentType: 'application/json',
        body:
          status >= 400
            ? errorBody(meridianTodoData.api.errorMessage)
            : JSON.stringify({ ...existing, ...updates }),
      });
      return;
    }

    if (method === 'DELETE' && /\/api\/tasks\/[^/]+$/.test(url)) {
      const status = options.tasksDeleteStatus ?? 204;
      await route.fulfill({
        status,
        contentType: 'application/json',
        body: status >= 400 ? errorBody(meridianTodoData.api.errorMessage) : '',
      });
      return;
    }

    await route.continue();
  };

  const handleProjects = async (route: Route): Promise<void> => {
    if (options.abortProjects) {
      await route.abort('failed');
      return;
    }
    if (options.delayMs) {
      await delay(options.delayMs);
    }

    const method = route.request().method();
    const url = route.request().url();

    if (method === 'GET' && url.endsWith('/api/projects')) {
      const status = options.projectsGetStatus ?? 200;
      await route.fulfill({
        status,
        contentType: 'application/json',
        body:
          status >= 400
            ? errorBody(meridianTodoData.api.errorMessage)
            : JSON.stringify(projects),
      });
      return;
    }

    if (method === 'POST' && url.endsWith('/api/projects')) {
      const status = options.projectsPostStatus ?? 201;
      const body = route.request().postDataJSON() as { name: string; color: string };
      await route.fulfill({
        status,
        contentType: 'application/json',
        body:
          status >= 400
            ? errorBody(meridianTodoData.api.errorMessage)
            : JSON.stringify({
                id: 'proj-mock-new',
                name: body.name,
                color: body.color,
                createdAt: new Date().toISOString(),
              }),
      });
      return;
    }

    if (method === 'DELETE' && /\/api\/projects\/[^/]+$/.test(url)) {
      const status = options.projectsDeleteStatus ?? 204;
      await route.fulfill({
        status,
        contentType: 'application/json',
        body: status >= 400 ? errorBody(meridianTodoData.api.errorMessage) : '',
      });
      return;
    }

    await route.continue();
  };

  await page.route('**/api/tasks**', handleTasks);
  await page.route('**/api/projects**', handleProjects);
}

export async function gotoWithFreshSeed(page: Page, path: string): Promise<void> {
  await clearAppStorage(page);
  await page.goto(`${BASE_URL}${path}`);
  await page.waitForLoadState('domcontentloaded');
}
