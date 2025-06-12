export interface Poll {
  id: string;
  title: string;
  options: string[];
  // tags: string[];
  createdAt: string;
}

export interface CreatePollInput {
  title: string;
  options: string[];
  // tags?: string[];
}

export interface GetPollsInput {
  tag?: string;
  page?: number;
  limit?: number;
  userId: string;
}

export interface PollStats {
  pollId: string;
  votes: { option: string; count: number }[];
}
