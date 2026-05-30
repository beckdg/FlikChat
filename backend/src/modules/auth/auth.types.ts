export interface RegisterInput {
  email: string;
  username: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
  };
  tokens: AuthTokens;
}
