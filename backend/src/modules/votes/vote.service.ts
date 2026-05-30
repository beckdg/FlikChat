// Vote business logic will be implemented here

export class VoteService {
  async vote(_userId: string, _data: unknown): Promise<void> {
    throw new Error('Not implemented');
  }

  async removeVote(_userId: string, _answerId: string): Promise<void> {
    throw new Error('Not implemented');
  }

  async getVoteSummary(_answerId: string): Promise<void> {
    throw new Error('Not implemented');
  }
}

export const voteService = new VoteService();
