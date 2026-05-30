import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export const HomePage = () => {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Welcome to FlikChat
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          A Q&A platform where every answer has its own real-time discussion room.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/register">
            <Button>Get Started</Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary">Sign In</Button>
          </Link>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-8">
        <h2 className="text-xl font-semibold text-gray-900">Recent Questions</h2>
        <p className="mt-4 text-gray-500">Questions will appear here once implemented.</p>
      </section>
    </div>
  );
};
