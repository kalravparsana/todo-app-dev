import { query } from './pool.js';

const MIGRATION_SQL = `
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  color VARCHAR(32) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  notes TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL,
  due_date DATE,
  scheduled_date DATE,
  project_id VARCHAR(64) REFERENCES projects(id) ON DELETE SET NULL,
  committed_to_today BOOLEAN NOT NULL DEFAULT false,
  priority VARCHAR(16) NOT NULL DEFAULT 'none'
);

CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_scheduled_date ON tasks(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
`;

async function migrate() {
  await query(MIGRATION_SQL);
  console.log('Migrations applied.');
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
