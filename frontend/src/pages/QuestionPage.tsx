import { useParams } from 'react-router-dom';

export const QuestionPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Question Detail</h1>
      <p className="text-gray-500">Question ID: {id}</p>
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Answers</h2>
        <p className="mt-2 text-gray-500">Answers and discussion rooms will appear here.</p>
      </div>
    </div>
  );
};
