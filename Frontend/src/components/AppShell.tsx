import { NavLink, Outlet } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { Icon } from '@/components/Icon';
import navToday from '@/assets/icons/nav-today.svg';
import navInbox from '@/assets/icons/nav-inbox.svg';
import navUpcoming from '@/assets/icons/nav-upcoming.svg';
import navProjects from '@/assets/icons/nav-projects.svg';
import { isApiEnabled } from '@/lib/todoApi';
import { useTodos } from '@/hooks/useTodos';
import { getTodayString } from '@/lib/todoStore';

const navItems = [
  { to: '/app/today', label: 'Today', icon: navToday },
  { to: '/app/inbox', label: 'Inbox', icon: navInbox },
  { to: '/app/upcoming', label: 'Upcoming', icon: navUpcoming },
  { to: '/app/projects', label: 'Projects', icon: navProjects },
];

export function AppShell() {
  const { tasks, loading, error } = useTodos();
  const today = getTodayString();

  const inboxCount = tasks.filter(
    (t) => !t.completed && !t.projectId && !t.committedToToday && !t.scheduledDate,
  ).length;

  const todayCount = tasks.filter(
    (t) => !t.completed && t.committedToToday,
  ).length;

  const upcomingCount = tasks.filter(
    (t) =>
      !t.completed &&
      t.scheduledDate &&
      t.scheduledDate > today,
  ).length;

  const badgeFor = (path: string) => {
    if (path === '/app/inbox' && inboxCount > 0) return inboxCount;
    if (path === '/app/today' && todayCount > 0) return todayCount;
    if (path === '/app/upcoming' && upcomingCount > 0) return upcomingCount;
    return 0;
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface md:flex">
        <div className="border-b border-border px-5 py-5">
          <Logo />
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Main">
          {navItems.map((item) => {
            const count = badgeFor(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`
                }
              >
                <Icon src={item.icon} className="h-5 w-5 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {count > 0 && (
                  <span className="tabular-nums rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                    {count}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
        <div className="border-t border-border p-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            {isApiEnabled()
              ? 'Tasks sync with the Meridian API.'
              : 'Tasks save locally in your browser — no account required for this preview.'}
          </p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 md:hidden">
          <Logo />
        </header>
        <nav
          className="flex border-b border-border bg-surface md:hidden"
          aria-label="Mobile"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors duration-200 ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`
              }
            >
              <Icon src={item.icon} className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <main className="flex-1 overflow-auto">
          {loading && (
            <p className="px-4 py-2 text-sm text-muted-foreground" role="status">
              Loading tasks…
            </p>
          )}
          {error && (
            <p className="mx-4 mt-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
