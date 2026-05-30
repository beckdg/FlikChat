export interface UserProfile {
  id: string;
  email: string;
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: Date;
}

export interface UpdateUserInput {
  username?: string;
  bio?: string;
  avatarUrl?: string;
}
