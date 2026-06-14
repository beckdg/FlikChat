import { useState, KeyboardEvent } from 'react';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  max?: number;
}

export const TagInput = ({ value, onChange, placeholder = 'Add tags...', max = 10 }: TagInputProps) => {
  const [input, setInput] = useState('');

  const addTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase();
    if (!trimmed || value.includes(trimmed) || value.length >= max) return;
    onChange([...value, trimmed]);
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
      setInput('');
    }
    if (e.key === 'Backspace' && !input && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Tags
      </label>
      <div
        className="input-field flex flex-wrap items-center gap-1.5 min-h-[42px] cursor-text"
        onClick={(e) => {
          const input = (e.currentTarget as HTMLElement).querySelector('input');
          input?.focus();
        }}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-lg bg-primary-100 px-2.5 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              className="inline-flex items-center justify-center rounded-full hover:bg-primary-200 dark:hover:bg-primary-800/60 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </span>
        ))}
        <input
          className="flex-1 border-none bg-transparent p-0 text-sm text-gray-900 placeholder-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder-gray-500 min-w-[120px]"
          placeholder={value.length >= max ? 'Max tags reached' : placeholder}
          value={input}
          onChange={(e) => {
            const val = e.target.value;
            if (val.includes(',')) {
              const parts = val.split(',');
              parts.forEach((p) => addTag(p));
              setInput('');
            } else {
              setInput(val);
            }
          }}
          onKeyDown={handleKeyDown}
          disabled={value.length >= max}
        />
      </div>
      {value.length > 0 && (
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {value.length}/{max} tags
        </p>
      )}
    </div>
  );
};
