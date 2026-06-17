import { query } from './pool.js';

const SEED_PROJECTS = [
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

const SEED_TASKS = [
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

async function seed() {
  const projectCount = await query(`SELECT COUNT(*)::int AS count FROM projects`);
  if ((projectCount.rows[0] as { count: number }).count > 0) {
    console.log('Database already seeded — skipping.');
    return;
  }

  for (const p of SEED_PROJECTS) {
    await query(
      `INSERT INTO projects (id, name, color, created_at) VALUES ($1,$2,$3,$4)`,
      [p.id, p.name, p.color, new Date(p.createdAt)],
    );
  }

  for (const t of SEED_TASKS) {
    await query(
      `INSERT INTO tasks (
        id, title, notes, completed, completed_at, created_at, due_date,
        scheduled_date, project_id, committed_to_today, priority
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [
        t.id,
        t.title,
        t.notes ?? null,
        t.completed,
        t.completedAt ? new Date(t.completedAt) : null,
        new Date(t.createdAt),
        t.dueDate ?? null,
        t.scheduledDate ?? null,
        t.projectId ?? null,
        t.committedToToday,
        t.priority,
      ],
    );
  }

  console.log('Seed data inserted.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
