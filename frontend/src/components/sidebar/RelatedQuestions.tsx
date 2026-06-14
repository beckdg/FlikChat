import { Link } from 'react-router-dom';

interface RelatedQuestion {
  id: string;
  title: string;
  answerCount: number;
}

const MOCK: RelatedQuestion[] = [
  { id: '6', title: 'How to use React Query with Next.js?', answerCount: 8 },
  { id: '7', title: 'What is the correct way to handle errors in React?', answerCount: 12 },
  { id: '8', title: 'React 19 new features overview?', answerCount: 5 },
  { id: '9', title: 'How to structure a large React project?', answerCount: 10 },
];

interface RelatedQuestionsProps {
  currentQuestionId?: string;
}

export const RelatedQuestions = ({ currentQuestionId }: RelatedQuestionsProps) => {
  const items = currentQuestionId ? MOCK.filter((q) => q.id !== currentQuestionId) : MOCK;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
            <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Related Questions</h3>
      </div>
      <div className="space-y-1">
        {items.slice(0, 4).map((q) => (
          <Link
            key={q.id}
            to={`/questions/${q.id}`}
            className="group flex items-start gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400 dark:text-gray-500">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-700 line-clamp-2 group-hover:text-primary-600 dark:text-gray-300 dark:group-hover:text-primary-400">
                {q.title}
              </p>
              <p className="mt-0.5 text-[10px] text-gray-400 dark:text-gray-500">{q.answerCount} answers</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
