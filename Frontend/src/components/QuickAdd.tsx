import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { Icon } from '@/components/Icon';
import addIcon from '@/assets/icons/icon-add.svg';

type QuickAddProps = {
  placeholder?: string;
  onAdd: (title: string) => void;
  autoFocus?: boolean;
  className?: string;
};

export function QuickAdd({
  placeholder = 'Add a task…',
  onAdd,
  autoFocus = false,
  className = '',
}: QuickAddProps) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setValue('');
      e.currentTarget.blur();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`group flex items-center gap-3 rounded-xl border bg-surface px-4 py-3 transition-colors duration-200 ${
        focused ? 'border-primary/40 shadow-card' : 'border-border'
      } ${className}`}
    >
      <Icon
        src={addIcon}
        className={`h-5 w-5 shrink-0 transition-colors duration-200 ${
          focused ? 'text-primary' : 'text-muted-foreground'
        }`}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label="New task"
        className="min-w-0 flex-1 bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Add
      </button>
    </form>
  );
}
