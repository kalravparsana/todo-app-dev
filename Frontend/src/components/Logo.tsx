import { Link } from 'react-router-dom';
import logoMark from '@/assets/logos/logo-mark.svg';

type LogoProps = {
  className?: string;
  showWordmark?: boolean;
};

export function Logo({ className = '', showWordmark = true }: LogoProps) {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2.5 text-foreground transition-opacity duration-200 hover:opacity-80 ${className}`}
    >
      <img src={logoMark} alt="" aria-hidden="true" className="h-8 w-8 shrink-0" />
      {showWordmark && (
        <span className="font-display text-xl font-semibold tracking-tight">
          Meridian
        </span>
      )}
    </Link>
  );
}
