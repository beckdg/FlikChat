import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTrendingQuestions } from '@/services/questions';
import { Button } from '@/components/ui/Button';

const features = [
  {
    title: 'Ask Questions',
    desc: 'Get answers from the community on any topic that matters to you.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.328a49.14 49.14 0 004.028-6.855 49.188 49.188 0 00-3.343-1.04.75.75 0 01.344-1.352 60.602 60.602 0 013.543-1.57z" />
        <path d="M4.205 10.377a.75.75 0 01.574.802 9.97 9.97 0 01.088 2.2.75.75 0 01-.445.786l-1.713.772a.75.75 0 01-1.027-.897 11.48 11.48 0 01.72-2.108.75.75 0 01.803-.455z" />
        <path d="M2.278 12.582a.75.75 0 01.97-.428 10.12 10.12 0 001.86.704.75.75 0 01.413 1.14 9.422 9.422 0 01-1.693 1.541.75.75 0 01-.946-.103 10.66 10.66 0 01-1.604-2.854zM17.777 12.582a.75.75 0 00-.97-.428 10.12 10.12 0 01-1.86.704.75.75 0 00-.413 1.14 9.422 9.422 0 001.693 1.541.75.75 0 00.946-.103 10.66 10.66 0 001.604-2.854z" />
        <path d="M17.868 16.21a.75.75 0 01.247.838 11.44 11.44 0 01-1.777 3.098.75.75 0 01-1.215-.052 11.243 11.243 0 00-.664-1.125.75.75 0 011.033-1.07c.368.345.777.647 1.222.888a.75.75 0 01.154-.617zM6.132 16.21a.75.75 0 00-.247.838 11.44 11.44 0 001.777 3.098.75.75 0 001.215-.052 11.243 11.243 0 01.664-1.125.75.75 0 00-1.033-1.07 10.14 10.14 0 00-1.222.888.75.75 0 01-.154-.617z" />
      </svg>
    ),
  },
  {
    title: 'Real-time Chat',
    desc: 'Discuss answers in live chat rooms with instant messaging.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
        <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
      </svg>
    ),
  },
  {
    title: 'Vote & Share',
    desc: 'Upvote helpful answers and share knowledge with the community.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M11.47 1.72a.75.75 0 011.06 0l3 3a.75.75 0 01-1.06 1.06l-1.72-1.72V7.5h-1.5V4.06L9.53 5.78a.75.75 0 01-1.06-1.06l3-3zM11.25 7.5V15a.75.75 0 001.5 0V7.5h3.75a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9a3 3 0 013-3h3.75z" />
      </svg>
    ),
  },
  {
    title: 'Organized Discussions',
    desc: 'Each answer has its own dedicated discussion room.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
      </svg>
    ),
  },
  {
    title: 'Knowledge Base',
    desc: 'Build a searchable archive of questions and answers.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
      </svg>
    ),
  },
  {
    title: 'Community Driven',
    desc: 'Join a growing community of learners and experts.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
      </svg>
    ),
  },
];

export const HomePage = () => {
  const { data: trendingData, isLoading: trendingLoading } = useQuery({
    queryKey: ['trending'],
    queryFn: getTrendingQuestions,
  });

  const trending = trendingData?.data ?? [];

  return (
    <div className="space-y-16 sm:space-y-24">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 shadow-2xl shadow-primary-500/20 dark:from-primary-950 dark:via-primary-900 dark:to-purple-950">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/[0.03] blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-purple-400/[0.04] blur-3xl" />
        <div className="relative px-6 py-14 sm:px-12 sm:py-20 lg:px-16 lg:py-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
            <span className="flex h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse-soft" />
            Real-time discussions
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Where questions meet{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-purple-200">
              real-time answers
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/70 sm:text-xl">
            A Q&A platform where every answer has its own real-time discussion room.
            Ask questions, get answers, and dive deeper with live conversations.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/register">
              <Button
                variant="primary"
                className="!bg-white !text-primary-700 !shadow-xl !shadow-black/10 hover:!bg-gray-100 hover:!shadow-2xl"
              >
                Get Started Free
              </Button>
            </Link>
            <Link to="/questions">
              <Button
                variant="secondary"
                className="!border-white/25 !bg-white/10 !text-white !shadow-lg hover:!bg-white/20 dark:!border-white/15"
              >
                Browse Questions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {!trendingLoading && trending.length > 0 && (
        <section>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                🔥 Trending Now
              </h2>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                Most active questions from the past week
              </p>
            </div>
            <Link
              to="/questions"
              className="text-sm font-medium text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              View all &rarr;
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {trending.map((q) => (
              <Link
                key={q.id}
                to={`/questions/${q.id}`}
                className="card group flex items-start gap-4 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 text-sm font-bold text-white shadow-md shadow-primary-500/15">
                  {q.author.username.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400">
                    {q.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                    {q.content}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                    <span>{q.author.username}</span>
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                        <path d="M3.505 2.365A41.369 41.369 0 019 2c1.863 0 3.697.124 5.495.365 1.247.167 2.18 1.108 2.435 2.268a4.45 4.45 0 00-.577-.069 43.141 43.141 0 00-4.706 0C9.229 4.696 7.5 6.727 7.5 8.998v2.24c0 1.413.67 2.735 1.76 3.562l-2.98 2.98A.75.75 0 015 17.25v-3.443c-.501-.048-1-.106-1.495-.172C2.033 13.438 1 12.162 1 10.655V4.706c0-1.57 1.176-2.895 2.505-2.341z" />
                        <path d="M14.5 6.5c1.064 0 2.09.07 3.09.195 1.416.177 2.41 1.36 2.41 2.74v3.346c0 1.506-1.032 2.782-2.505 2.942-.494.066-.994.124-1.495.172v3.443a.75.75 0 01-1.28.53l-2.98-2.98a4.47 4.47 0 01-.596-.595 3.5 3.5 0 011.09-.329c.588-.083 1.187-.15 1.79-.2A4.46 4.46 0 0115 11.24v-2.24c0-1.364-.625-2.602-1.622-3.5H14.5z" />
                      </svg>
                      {q.answerCount ?? 0}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Everything you need to{' '}
            <span className="gradient-text">learn and share</span>
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400">
            FlikChat combines the best of Q&A platforms with real-time discussions.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="card group p-6 transition-all duration-300 hover:-translate-y-0.5"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 text-white shadow-lg shadow-primary-500/15 transition-all duration-300 group-hover:scale-110 group-hover:shadow-primary-500/30">
                {feature.icon}
              </div>
              <h3 className="mt-4 font-semibold text-gray-900 dark:text-gray-100">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-3xl border border-gray-200/60 bg-gradient-to-br from-gray-50 to-white p-8 shadow-sm dark:border-gray-700/30 dark:from-gray-900/50 dark:to-gray-800/30 sm:p-12">
        <div className="absolute inset-0 bg-grid opacity-30 dark:opacity-10" />
        <div className="relative mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 text-2xl font-bold text-white shadow-lg shadow-primary-500/20">
            F
          </div>
          <h2 className="mt-5 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Ready to join the conversation?
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Create your account and start asking questions in minutes.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button size="lg">Create Your Account</Button>
            </Link>
            <Link to="/questions">
              <Button variant="secondary" size="lg">Browse Questions</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
