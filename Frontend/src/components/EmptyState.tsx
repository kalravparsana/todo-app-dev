import type { ReactNode } from 'react';

type EmptyStateProps = {
  illustration: string;
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({
  illustration,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <img
        src={illustration}
        alt=""
        aria-hidden="true"
        className="mb-8 w-full max-w-[220px]"
      />
      <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
