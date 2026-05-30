export interface Vote {
  id: string;
  value: number;
  answerId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateVoteInput {
  value: number;
  answerId: string;
}

export interface VoteSummary {
  answerId: string;
  upvotes: number;
  downvotes: number;
  score: number;
}
