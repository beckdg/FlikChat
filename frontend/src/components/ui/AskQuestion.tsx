import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { TagInput } from '@/components/ui/TagInput';
import { QUESTION_TYPES, QuestionType } from '@/types';

interface AskQuestionProps {
  onSubmit: (data: { title: string; content: string; type: QuestionType; tags: string[] }) => void;
  onCancel?: () => void;
  isPending?: boolean;
}

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
    <form onSubmit={handleSubmit} className="card p-5 sm:p-6 space-y-4 animate-slide-down">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Ask a Question</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Title
        </label>
        <input
          className="input-field"
          placeholder="What's on your mind?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          minLength={5}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Content
        </label>
        <textarea
          className="input-field min-h-[100px] resize-y"
          placeholder="Provide some details..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          minLength={10}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Type
        </label>
        <div className="flex flex-wrap gap-2">
          {QUESTION_TYPES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setType(value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                type === value
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <TagInput value={tags} onChange={setTags} />

      <div className="flex justify-end gap-3 pt-1">
        {onCancel && (
          <Button variant="ghost" type="button" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isPending}>
          Post Question
        </Button>
      </div>
    </form>
  );
};
