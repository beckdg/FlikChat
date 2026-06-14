export interface UserProfile {
  id: string;
  email: string;
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
  createdAt: Date;
  questionCount: number;
  answerCount: number;
}

export interface UpdateUserInput {
  username?: string;
  bio?: string;
  avatarUrl?: string;
  coverUrl?: string;
}
