import { User } from '@/model/user.entity';

export interface UpdateUserPasswordDataRequest {
  password?: string;
}

export interface UpdateUserProfileDataRequest {
  username: string;
  description: string;
  profileImage?: string;
}

export interface CreateUserRequest {
  email: string;
  username: string;
  password?: string;
  profileImage?: string;
  socialProvider?: SocialProvider;
}

export const SOCIAL_PROVIDERS = {
  GOOGLE: 'google',
} as const;

export type SocialProvider = (typeof SOCIAL_PROVIDERS)[keyof typeof SOCIAL_PROVIDERS];

export type TokenResponse = {
  accessToken: string;
  refreshToken: string;
};

export type SignupResponse = {
  user: User;
  tokens: TokenResponse;
};

export type UserSummary = { id: number; userId: string; profileImage: string };
