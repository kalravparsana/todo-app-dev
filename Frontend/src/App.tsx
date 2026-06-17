import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { TodoProvider } from '@/hooks/useTodos';
import { AppShell } from '@/components/AppShell';
import { LandingPage } from '@/pages/LandingPage';
import { TodayPage } from '@/pages/TodayPage';
import { InboxPage } from '@/pages/InboxPage';
import { UpcomingPage } from '@/pages/UpcomingPage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { ProjectDetailPage } from '@/pages/ProjectDetailPage';

/*
 * SEMANTIC ANALYSIS — Meridian todo app
 * - Marketing landing (/) → persuasion + CTA to app
 * - App shell with sidebar nav → Today / Inbox / Upcoming / Projects
 * - Today → Commit Rail (signature), quick add, committed vs scheduled lists
 * - Inbox → frictionless capture, triage later
 * - Upcoming → date-grouped future tasks
 * - Projects → grid of project cards + create form
 * - Project detail → tasks scoped to one project
 * - All state persisted to localStorage via TodoProvider
 */
export default function App() {
  return (
    <TodoProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<AppShell />}>
            <Route index element={<Navigate to="today" replace />} />
            <Route path="today" element={<TodayPage />} />
            <Route path="inbox" element={<InboxPage />} />
            <Route path="upcoming" element={<UpcomingPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:id" element={<ProjectDetailPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TodoProvider>
  );
}
