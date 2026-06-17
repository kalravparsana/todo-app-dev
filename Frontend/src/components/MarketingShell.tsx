import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import arrowIcon from '@/assets/icons/icon-arrow.svg';

type MarketingShellProps = {
  children: ReactNode;
};

export function MarketingShell({ children }: MarketingShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-surface/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
          <Logo />
          <nav className="flex items-center gap-3">
            <Link
              to="/app/today"
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              to="/app/today"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
            >
              Open app
              <img src={arrowIcon} alt="" aria-hidden="true" className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-border bg-muted/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-10 text-sm text-muted-foreground lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <Logo showWordmark />
          <p>Draw the line on what matters today.</p>
        </div>
      </footer>
    </div>
  );
}
