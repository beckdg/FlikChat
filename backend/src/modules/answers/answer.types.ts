export interface Answer {
  id: string;
  content: string;
  questionId: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAnswerInput {
  content: string;
  questionId: string;
}

export interface UpdateAnswerInput {
  content?: string;
}

export interface AnswerWithAuthor extends Answer {
  author: {
    id: string;
    username: string;
    avatarUrl: string | null;
  };
}
