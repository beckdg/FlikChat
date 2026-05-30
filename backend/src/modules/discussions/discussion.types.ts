export interface ChatRoom {
  id: string;
  answerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  content: string;
  roomId: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SendMessageInput {
  content: string;
  roomId: string;
}

export interface ChatMessageWithAuthor extends ChatMessage {
  author: {
    id: string;
    username: string;
    avatarUrl: string | null;
  };
}
