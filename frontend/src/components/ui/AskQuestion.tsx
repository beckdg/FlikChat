import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { TagInput } from '@/components/ui/TagInput';
import { QUESTION_TYPES, QuestionType } from '@/types';

interface AskQuestionProps {
  onSubmit: (data: { title: string; content: string; type: QuestionType; tags: string[] }) => void;
  onCancel?: () => void;
  isPending?: boolean;
}

const TYPE_ICONS: Record<string, JSX.Element> = {
  general: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
    </svg>
  ),
  discussion: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path d="M3.505 2.365A41.369 41.369 0 019 2c1.863 0 3.697.124 5.495.365 1.247.167 2.18 1.108 2.435 2.268a4.45 4.45 0 00-.577-.069 43.141 43.141 0 00-4.706 0C9.229 4.696 7.5 6.727 7.5 8.998v2.24c0 1.413.67 2.735 1.76 3.562l-2.98 2.98A.75.75 0 015 17.25v-3.443c-.501-.048-1-.106-1.495-.172C2.033 13.438 1 12.162 1 10.655V4.706c0-1.57 1.176-2.895 2.505-2.341z" />
      <path d="M14.5 6.5c1.064 0 2.09.07 3.09.195 1.416.177 2.41 1.36 2.41 2.74v3.346c0 1.506-1.032 2.782-2.505 2.942-.494.066-.994.124-1.495.172v3.443a.75.75 0 01-1.28.53l-2.98-2.98a4.47 4.47 0 01-.596-.595 3.5 3.5 0 011.09-.329c.588-.083 1.187-.15 1.79-.2A4.46 4.46 0 0115 11.24v-2.24c0-1.364-.625-2.602-1.622-3.5H14.5z" />
    </svg>
  ),
  help: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path d="M10.362 1.093a.75.75 0 00-.724 0L2.523 5.018a.75.75 0 000 1.296L5.3 7.862 2.872 9.419a.75.75 0 000 1.296L5.3 12.16l-2.777 2.024a.75.75 0 000 1.296l7.115 3.925a.75.75 0 00.724 0l7.115-3.925a.75.75 0 000-1.296L14.7 12.16l2.428-1.445a.75.75 0 000-1.296L14.7 7.862l2.777-2.024a.75.75 0 000-1.296l-7.115-3.925z" />
    </svg>
  ),
  idea: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path d="M10 1a6 6 0 00-3.815 10.631C7.237 12.5 8 13.443 8 14.456v.644a.75.75 0 00.572.729 6.016 6.016 0 002.856 0A.75.75 0 0012 15.1v-.644c0-1.013.762-1.957 1.815-2.825A6 6 0 0010 1zM8.863 17.414a.75.75 0 00-.226 1.483 9.066 9.066 0 002.726 0 .75.75 0 00-.226-1.483 7.553 7.553 0 01-2.274 0z" />
    </svg>
  ),
  poll: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path d="M12 9a1 1 0 01-1 1H3a1 1 0 011-1h8a1 1 0 011 1z" />
      <path d="M12 5a1 1 0 01-1 1H3a1 1 0 010-2h8a1 1 0 011 1z" />
      <path d="M12 13a1 1 0 01-1 1H3a1 1 0 010-2h7a1 1 0 011 1z" />
      <path d="M17 4a1 1 0 011 1v10a1 1 0 01-2 0V5a1 1 0 011-1z" />
    </svg>
  ),
};

const TYPE_DESCRIPTIONS: Record<string, string> = {
  general: 'Open general discussion',
  discussion: 'Start a conversation',
  help: 'Get help or support',
  idea: 'Share a suggestion',
  poll: 'Create a poll',
};

export const AskQuestion = ({ onSubmit, onCancel, isPending }: AskQuestionProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<QuestionType>('general');
  const [tags, setTags] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onSubmit({ title: title.trim(), content: content.trim(), type, tags });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card overflow-hidden animate-slide-down">
      <div className="border-b border-gray-100 bg-gradient-to-r from-primary-50/50 to-transparent px-5 py-4 dark:border-gray-800 dark:from-primary-900/10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M10.362 1.093a.75.75 0 00-.724 0L2.523 5.018a.75.75 0 000 1.296L5.3 7.862 2.872 9.419a.75.75 0 000 1.296L5.3 12.16l-2.777 2.024a.75.75 0 000 1.296l7.115 3.925a.75.75 0 00.724 0l7.115-3.925a.75.75 0 000-1.296L14.7 12.16l2.428-1.445a.75.75 0 000-1.296L14.7 7.862l2.777-2.024a.75.75 0 000-1.296l-7.115-3.925z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Ask a Question</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Share your thoughts with the community</p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Title
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute left-3 top-3.5 text-gray-400 dark:text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M4 3.5A1.5 1.5 0 015.5 2h2A1.5 1.5 0 019 3.5v2A1.5 1.5 0 017.5 7h-2A1.5 1.5 0 014 5.5v-2zM4 10.5A1.5 1.5 0 015.5 9h2A1.5 1.5 0 019 10.5v2A1.5 1.5 0 017.5 14h-2A1.5 1.5 0 014 12.5v-2zM11 4.5a.75.75 0 01.75-.75h3.5a.75.75 0 010 1.5h-3.5A.75.75 0 0111 4.5zM11 9a.75.75 0 01.75-.75h3.5a.75.75 0 010 1.5h-3.5A.75.75 0 0111 9zM11 13.5a.75.75 0 01.75-.75h3.5a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75zM4 17.5A1.5 1.5 0 015.5 16h2A1.5 1.5 0 019 17.5v2A1.5 1.5 0 017.5 21h-2A1.5 1.5 0 014 19.5v-2z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              className="input-field pl-9 pr-16"
              placeholder="e.g. How do I deploy a Node.js app?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={5}
              maxLength={120}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-gray-400 dark:text-gray-500">
              {title.length}/120
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Details
          </label>
          <div className="relative">
            <textarea
              className="input-field min-h-[120px] resize-y pb-7"
              placeholder="Describe your question in detail. Include code snippets, screenshots, or steps to reproduce if applicable..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              minLength={10}
              maxLength={2000}
            />
            <span className="pointer-events-none absolute bottom-2 right-3 text-[10px] font-medium text-gray-400 dark:text-gray-500">
              {content.length}/2000
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {QUESTION_TYPES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setType(value)}
                className={`flex flex-col items-center gap-1 rounded-xl border-2 px-3 py-3 text-center transition-all duration-200 ${
                  type === value
                    ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm dark:border-primary-400 dark:bg-primary-900/20 dark:text-primary-300'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:bg-gray-800'
                }`}
              >
                <span className={`${type === value ? 'text-primary-500 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`}>
                  {TYPE_ICONS[value]}
                </span>
                <span className="text-xs font-semibold">{label}</span>
                <span className="text-[10px] leading-tight opacity-70">{TYPE_DESCRIPTIONS[value]}</span>
              </button>
            ))}
          </div>
        </div>

        <TagInput value={tags} onChange={setTags} />

        <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
          <p className="hidden sm:block text-xs text-gray-400 dark:text-gray-500">
            Your question will be visible to the community
          </p>
          <div className="flex gap-3">
            {onCancel && (
              <Button variant="ghost" type="button" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" isLoading={isPending}>
              Post Question
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
