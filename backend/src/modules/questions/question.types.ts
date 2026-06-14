export interface Question {
  id: string;
  title: string;
  content: string;
  type: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateQuestionInput {
  title: string;
  content: string;
  type?: string;
  tags?: string[];
}

export interface UpdateQuestionInput {
  title?: string;
  content?: string;
  type?: string;
  tags?: string[];
}

export interface QuestionWithAuthor extends Question {
  author: {
    id: string;
    username: string;
    avatarUrl: string | null;
  };
}
