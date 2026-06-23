import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFeed, getQuestions as searchQuestions, createQuestion, type QuestionFilters } from '@/services/questions';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { FeedCard } from '@/components/ui/FeedCard';
import { AskQuestion } from '@/components/ui/AskQuestion';
import { SidebarLayout, TrendingQuestions, TopicFilters, QuickActions, PopularTags } from '@/components/sidebar';
import { QUESTION_TYPES } from '@/types';

const feedTabs = [
  { id: 'recent', label: 'Recent' },
  { id: 'trending', label: 'Trending' },
  { id: 'unanswered', label: 'Unanswered' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'answers', label: 'Most Answers' },
] as const;

export const QuestionsPage = () => {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('recent');

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearch(searchFromUrl);
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const isSearching = !!debouncedSearch || !!typeFilter;

  const filters: QuestionFilters = {
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(typeFilter && { type: typeFilter }),
    sortBy: sortBy as 'newest' | 'answers',
  };

  const { data: feedData, isLoading: feedLoading } = useQuery({
    queryKey: ['questions-feed', activeTab],
    queryFn: () => getFeed(activeTab),
    enabled: !isSearching,
  });

  const { data: searchData, isLoading: searchLoading } = useQuery({
    queryKey: ['questions-search', filters],
    queryFn: () => searchQuestions(1, 50, filters),
    enabled: isSearching,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions-feed'] });
      setShowForm(false);
    },
  });

  const questions = isSearching
    ? (searchData?.data?.items ?? [])
    : (feedData?.data?.items ?? []);

  const isLoading = isSearching ? searchLoading : feedLoading;

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  return (
    <SidebarLayout
      sidebar={
        <>
          {isAuthenticated && <QuickActions />}
          <PopularTags />
          <TopicFilters />
          <TrendingQuestions />
        </>
      }
    >
      <div className="space-y-6 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
        </svg>
        Back
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Questions</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Browse questions or ask your own
          </p>
        </div>
        {isAuthenticated && (
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Ask Question'}
          </Button>
        )}
      </div>

      {showForm && (
        <div className="mx-auto max-w-2xl">
          <AskQuestion
            onSubmit={(data) => mutate(data)}
            onCancel={() => setShowForm(false)}
            isPending={isPending}
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
          </svg>
          <input
            className="input-field pl-9"
            placeholder="Search by title, content, or tags..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      </div>

      {!isSearching && (
        <div className="border-b border-gray-200 dark:border-gray-700/50">
          <div className="flex gap-1 -mb-px overflow-x-auto">
            {feedTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {isSearching && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mr-1">Type:</span>
          <button
            onClick={() => setTypeFilter('')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              !typeFilter
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
          >
            All
          </button>
          {QUESTION_TYPES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setTypeFilter(typeFilter === value ? '' : value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                typeFilter === value
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {label}
            </button>
          ))}

          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-3 mr-1">Sort:</span>
          {sortOptions.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setSortBy(value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                sortBy === value
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="flex gap-3">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-4 w-full rounded bg-gray-100 dark:bg-gray-800" />
                  <div className="flex gap-4">
                    <div className="h-3 w-16 rounded bg-gray-100 dark:bg-gray-800" />
                    <div className="h-3 w-12 rounded bg-gray-100 dark:bg-gray-800" />
                    <div className="h-3 w-12 rounded bg-gray-100 dark:bg-gray-800" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="card p-12 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600">
            <path d="M5.566 4.657A4.505 4.505 0 016.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0015.75 3h-7.5a3 3 0 00-2.684 1.657zM2.25 12a3 3 0 013-3h13.5a3 3 0 013 3v6a3 3 0 01-3 3H5.25a3 3 0 01-3-3v-6zM5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 016.75 6h10.5a3 3 0 012.683 1.657A4.505 4.505 0 0018.75 7.5H5.25z" />
          </svg>
          <p className="mt-4 font-medium text-gray-500 dark:text-gray-400">No questions found</p>
          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
            {isSearching
              ? 'No questions match your search criteria.'
              : activeTab === 'unanswered'
                ? 'Every question has been answered!'
                : 'Check back later for new questions.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q) => (
            <FeedCard
              key={q.id}
              question={q}
              queryKey={isSearching ? ['questions-search', filters] : ['questions-feed', activeTab]}
            />
          ))}
        </div>
      )}
    </div>
    </SidebarLayout>
  );
};
