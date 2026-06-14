import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div className="relative">
        <div className="text-[8rem] leading-none font-black tracking-tighter sm:text-[10rem]">
          <span className="gradient-text">4</span>
          <span className="gradient-text">0</span>
          <span className="gradient-text">4</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-32 w-32 rounded-full bg-primary-500/10 blur-3xl dark:bg-primary-400/10" />
        </div>
      </div>
      <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
        Page Not Found
      </h2>
      <p className="mt-2 max-w-md text-gray-500 dark:text-gray-400">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to="/" className="mt-8">
        <Button size="lg">Go Home</Button>
      </Link>
    </div>
  );
};
