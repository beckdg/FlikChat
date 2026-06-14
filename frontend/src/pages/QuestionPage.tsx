import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getQuestionById, updateQuestion, deleteQuestion, toggleQuestionLike } from '@/services/questions';
import { getAnswersByQuestion, createAnswer, updateAnswer, deleteAnswer, voteAnswer } from '@/services/answers';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { ChatRoom } from '@/components/chat/ChatRoom';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export const QuestionPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [answerContent, setAnswerContent] = useState('');
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState(false);
  const [editQuestionContent, setEditQuestionContent] = useState('');
  const [editingAnswer, setEditingAnswer] = useState<string | null>(null);
  const [editAnswerContent, setEditAnswerContent] = useState('');
  const [showDeleteQuestionModal, setShowDeleteQuestionModal] = useState(false);
  const [showDeleteAnswerModal, setShowDeleteAnswerModal] = useState<string | null>(null);
  const userId = user?.id;

  const { data: qData, isLoading: qLoading } = useQuery({
    queryKey: ['question', id],
    queryFn: () => getQuestionById(id!, userId),
    enabled: !!id,
  });

  const { data: aData, isLoading: aLoading } = useQuery({
    queryKey: ['answers', id, userId],
    queryFn: () => getAnswersByQuestion(id!, userId),
    enabled: !!id,
  });

  const createAnswerMutation = useMutation({
    mutationFn: createAnswer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['answers', id] });
      setAnswerContent('');
    },
  });

  const updateQuestionMutation = useMutation({
    mutationFn: (data: { title?: string; content?: string }) => updateQuestion(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question', id] });
      setEditingQuestion(false);
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: () => deleteQuestion(id!),
    onSuccess: () => navigate('/questions'),
  });

  const likeQuestionMutation = useMutation({
    mutationFn: () => toggleQuestionLike(id!),
    onSuccess: (res) => {
      queryClient.setQueryData(['question', id], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: { ...old.data, likedByUser: res.data?.liked, likeCount: res.data?.likeCount },
        };
      });
    },
  });

  const voteAnswerMutation = useMutation({
    mutationFn: ({ answerId, value }: { answerId: string; value: number }) => voteAnswer(answerId, value),
    onSuccess: (res, vars) => {
      queryClient.setQueryData(['answers', id, userId], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((a: any) =>
            a.id === vars.answerId
              ? {
                  ...a,
                  userVote: res.data?.voted ? vars.value : 0,
                  voteCount: res.data?.voted ? a.voteCount + (a.userVote === 0 ? 1 : 0) : a.voteCount - 1,
                }
              : a,
          ),
        };
      });
    },
  });

  const updateAnswerMutation = useMutation({
    mutationFn: ({ answerId, content }: { answerId: string; content: string }) => updateAnswer(answerId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['answers', id] });
      setEditingAnswer(null);
    },
  });

  const deleteAnswerMutation = useMutation({
    mutationFn: (answerId: string) => deleteAnswer(answerId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['answers', id] }),
  });

  const question = qData?.data;
  const answers = aData?.data ?? [];
  const isOwnQuestion = question?.author.id === user?.id;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answerContent.trim() && id) {
      createAnswerMutation.mutate({ content: answerContent.trim(), questionId: id });
    }
  };

  if (qLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="card p-8 animate-pulse space-y-4">
          <div className="h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-1/2 rounded bg-gray-100 dark:bg-gray-800" />
          <div className="h-20 rounded bg-gray-100 dark:bg-gray-800" />
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="card p-12 text-center animate-fade-in">
        <p className="text-gray-500 dark:text-gray-400">Question not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
        </svg>
        Back
      </button>

      <div className={`card overflow-hidden p-0 ${isOwnQuestion ? 'border-l-4 border-l-primary-500' : ''}`}>
        {isOwnQuestion && (
          <div className="flex items-center justify-end gap-1 px-6 pt-3">
            <button
              onClick={() => {
                if (editingQuestion) {
                  setEditingQuestion(false);
                  return;
                }
                setEditQuestionContent(question.content);
                setEditingQuestion(true);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
              </svg>
            </button>
            <button
              onClick={() => setShowDeleteQuestionModal(true)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c-.84 0-1.673.025-2.5.075V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25v.325C11.673 4.025 10.84 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
        <div className="h-2 bg-gradient-to-r from-primary-500 via-primary-600 to-purple-600" />
        <div className="p-6 sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
            {question.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
            <Link to={`/profile/${question.author.username}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <UserAvatar src={question.author.avatarUrl} username={question.author.username} size="sm" className="rounded-full" />
              <span className="font-medium text-gray-700 dark:text-gray-300">{question.author.username}</span>
            </Link>
            <span className="text-gray-300 dark:text-gray-600">·</span>
            <span>{new Date(question.createdAt).toLocaleDateString()}</span>
            <span className="text-gray-300 dark:text-gray-600">·</span>
            <span>{question.answerCount ?? 0} answers</span>
            <span className="text-gray-300 dark:text-gray-600">·</span>
            <button
              onClick={() => isAuthenticated && likeQuestionMutation.mutate()}
              disabled={!isAuthenticated || likeQuestionMutation.isPending}
              className={`inline-flex items-center gap-1 transition-colors ${
                isAuthenticated ? 'cursor-pointer hover:text-primary-500' : 'cursor-default'
              } ${question.likedByUser ? 'text-primary-500' : 'text-gray-500 dark:text-gray-400'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M1 8.25a1.25 1.25 0 112.5 0v7.5a1.25 1.25 0 11-2.5 0v-7.5zM11 3V1.7c0-.268.14-.526.395-.607A2 2 0 0114 3c0 .995-.182 1.948-.514 2.826-.204.54.166 1.174.744 1.174h2.52c1.243 0 2.261 1.01 2.146 2.247a23.864 23.864 0 01-1.341 5.974C17.153 16.323 16.072 17 14.9 17h-3.192a3 3 0 01-1.341-.317l-2.734-1.366A3 3 0 006.292 15H5V8h.963c.685 0 1.258-.483 1.612-1.068a4.011 4.011 0 012.166-1.73c.432-.143.853-.386 1.011-.814.16-.432.248-.9.248-1.388z" />
              </svg>
              <span>{question.likeCount ?? 0}</span>
            </button>
          </div>
          {editingQuestion ? (
            <div className="mt-4 space-y-3">
              <textarea
                className="input-field min-h-[100px] resize-y"
                value={editQuestionContent}
                onChange={(e) => setEditQuestionContent(e.target.value)}
                minLength={10}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => updateQuestionMutation.mutate({ content: editQuestionContent })} isLoading={updateQuestionMutation.isPending}>Save</Button>
                <Button size="sm" variant="ghost" onClick={() => setEditingQuestion(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <p className="mt-5 leading-relaxed text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
              {question.content}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Answers ({answers.length})
          </h2>
        </div>

        {aLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="card p-6 animate-pulse space-y-3">
                <div className="h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-16 rounded bg-gray-100 dark:bg-gray-800" />
              </div>
            ))}
          </div>
        ) : answers.length === 0 ? (
          <div className="card p-10 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600">
              <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
              <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
            </svg>
            <p className="mt-4 font-medium text-gray-500 dark:text-gray-400">No answers yet</p>
            <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">Be the first to answer this question.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {answers.map((answer) => {
              const isOwnAnswer = answer.author.id === user?.id;
              return (
              <div key={answer.id} className={`card overflow-hidden ${isOwnAnswer ? 'border-l-4 border-l-emerald-500' : ''}`}>
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between">
                    <Link to={`/profile/${answer.author.username}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                      <UserAvatar src={answer.author.avatarUrl} username={answer.author.username} size="sm" className="rounded-full" />
                      <div>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {answer.author.username}
                        </span>
                        <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
                          {new Date(answer.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </Link>
                    <div className="flex items-center gap-1">
                      {isOwnAnswer && (
                        <div className="flex items-center gap-0.5 mr-2">
                          <button
                            onClick={() => {
                              if (editingAnswer === answer.id) {
                                setEditingAnswer(null);
                                return;
                              }
                              setEditAnswerContent(answer.content);
                              setEditingAnswer(answer.id);
                            }}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                              <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setShowDeleteAnswerModal(answer.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                              <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c-.84 0-1.673.025-2.5.075V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25v.325C11.673 4.025 10.84 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      )}
                      <button
                        onClick={() => isAuthenticated && voteAnswerMutation.mutate({ answerId: answer.id, value: answer.userVote === 1 ? 0 : 1 })}
                        disabled={!isAuthenticated || voteAnswerMutation.isPending}
                        className={`inline-flex items-center gap-1 text-sm transition-colors ${
                          isAuthenticated ? 'cursor-pointer' : 'cursor-default'
                        } ${answer.userVote === 1 ? 'text-primary-500' : 'text-gray-400 dark:text-gray-500 hover:text-primary-500'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                          <path d="M1 8.25a1.25 1.25 0 112.5 0v7.5a1.25 1.25 0 11-2.5 0v-7.5zM11 3V1.7c0-.268.14-.526.395-.607A2 2 0 0114 3c0 .995-.182 1.948-.514 2.826-.204.54.166 1.174.744 1.174h2.52c1.243 0 2.261 1.01 2.146 2.247a23.864 23.864 0 01-1.341 5.974C17.153 16.323 16.072 17 14.9 17h-3.192a3 3 0 01-1.341-.317l-2.734-1.366A3 3 0 006.292 15H5V8h.963c.685 0 1.258-.483 1.612-1.068a4.011 4.011 0 012.166-1.73c.432-.143.853-.386 1.011-.814.16-.432.248-.9.248-1.388z" />
                        </svg>
                        <span>{answer.voteCount}</span>
                      </button>
                    </div>
                  </div>
                  {editingAnswer === answer.id ? (
                    <div className="mt-3 space-y-3">
                      <textarea
                        className="input-field min-h-[80px] resize-y"
                        value={editAnswerContent}
                        onChange={(e) => setEditAnswerContent(e.target.value)}
                        minLength={10}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => updateAnswerMutation.mutate({ answerId: answer.id, content: editAnswerContent })} isLoading={updateAnswerMutation.isPending}>Save</Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingAnswer(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                      {answer.content}
                    </p>
                  )}
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={() => setExpandedRoom(expandedRoom === answer.id ? null : answer.id)}
                    className="flex w-full items-center gap-2 px-5 py-2.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path d="M3.505 2.365A41.369 41.369 0 019 2c1.863 0 3.697.124 5.495.365 1.247.167 2.18 1.108 2.435 2.268a4.45 4.45 0 00-.577-.069 43.141 43.141 0 00-4.706 0C9.229 4.696 7.5 6.727 7.5 8.998v2.24c0 1.413.67 2.735 1.76 3.562l-2.98 2.98A.75.75 0 015 17.25v-3.443c-.501-.048-1-.106-1.495-.172C2.033 13.438 1 12.162 1 10.655V4.706c0-1.57 1.176-2.895 2.505-2.341z" />
                      <path d="M14.5 6.5c1.064 0 2.09.07 3.09.195 1.416.177 2.41 1.36 2.41 2.74v3.346c0 1.506-1.032 2.782-2.505 2.942-.494.066-.994.124-1.495.172v3.443a.75.75 0 01-1.28.53l-2.98-2.98a4.47 4.47 0 01-.596-.595 3.5 3.5 0 011.09-.329c.588-.083 1.187-.15 1.79-.2A4.46 4.46 0 0115 11.24v-2.24c0-1.364-.625-2.602-1.622-3.5H14.5z" />
                    </svg>
                    {expandedRoom === answer.id ? 'Hide Discussion' : 'Open Discussion Room'}
                  </button>
                  {expandedRoom === answer.id && answer.roomId && (
                    <div className="px-5 pb-4">
                      <ChatRoom roomId={answer.roomId} />
                    </div>
                  )}
                </div>
              </div>
            );
            })}
          </div>
        )}
      </div>

      {isAuthenticated ? (
        isOwnQuestion ? (
          <div className="card overflow-hidden">
            <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-500 dark:bg-amber-900/30 dark:text-amber-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">You cannot answer your own question</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Wait for the community to share their answers</p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card overflow-hidden">
            <div className="border-b border-gray-100 bg-gradient-to-r from-emerald-50/50 to-transparent px-5 py-4 dark:border-gray-800 dark:from-emerald-900/10">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path d="M3.505 2.365A41.369 41.369 0 019 2c1.863 0 3.697.124 5.495.365 1.247.167 2.18 1.108 2.435 2.268a4.45 4.45 0 00-.577-.069 43.141 43.141 0 00-4.706 0C9.229 4.696 7.5 6.727 7.5 8.998v2.24c0 1.413.67 2.735 1.76 3.562l-2.98 2.98A.75.75 0 015 17.25v-3.443c-.501-.048-1-.106-1.495-.172C2.033 13.438 1 12.162 1 10.655V4.706c0-1.57 1.176-2.895 2.505-2.341z" />
                    <path d="M14.5 6.5c1.064 0 2.09.07 3.09.195 1.416.177 2.41 1.36 2.41 2.74v3.346c0 1.506-1.032 2.782-2.505 2.942-.494.066-.994.124-1.495.172v3.443a.75.75 0 01-1.28.53l-2.98-2.98a4.47 4.47 0 01-.596-.595 3.5 3.5 0 011.09-.329c.588-.083 1.187-.15 1.79-.2A4.46 4.46 0 0115 11.24v-2.24c0-1.364-.625-2.602-1.622-3.5H14.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Your Answer</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Help the author by sharing your knowledge</p>
                </div>
              </div>
            </div>
            <div className="p-5 sm:p-6 space-y-4">
              <div className="relative">
                <textarea
                  className="input-field min-h-[140px] resize-y pb-7"
                  placeholder="Write a detailed answer. Include examples, code snippets, or references to help clarify your point..."
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                  required
                  minLength={10}
                  maxLength={5000}
                />
                <span className="pointer-events-none absolute bottom-2 right-3 text-[10px] font-medium text-gray-400 dark:text-gray-500">
                  {answerContent.length}/5000
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Provide a clear and thorough answer
                </p>
                <Button type="submit" isLoading={createAnswerMutation.isPending}>
                  Post Answer
                </Button>
              </div>
            </div>
          </form>
        )
      ) : (
        <div className="card overflow-hidden">
          <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
                <path d="M10 1a4.5 4.5 0 00-4.5 4.5v2H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 4.5V7H7V5.5a3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Sign in to post an answer</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">You need to be signed in to contribute</p>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showDeleteQuestionModal}
        onClose={() => setShowDeleteQuestionModal(false)}
        onConfirm={() => {
          deleteQuestionMutation.mutate();
          setShowDeleteQuestionModal(false);
        }}
        title="Delete Question"
        message="Are you sure you want to delete this question?"
        warning="This will permanently delete the question, all its answers, and all discussion rooms and chat messages associated with those answers. This action cannot be undone."
        confirmLabel="Delete Question"
      />

      <ConfirmModal
        isOpen={!!showDeleteAnswerModal}
        onClose={() => setShowDeleteAnswerModal(null)}
        onConfirm={() => {
          if (showDeleteAnswerModal) {
            deleteAnswerMutation.mutate(showDeleteAnswerModal);
            setShowDeleteAnswerModal(null);
          }
        }}
        title="Delete Answer"
        message="Are you sure you want to delete this answer?"
        warning="This will permanently delete the answer and its associated discussion room and all chat messages. This action cannot be undone."
        confirmLabel="Delete Answer"
      />
    </div>
  );
};
