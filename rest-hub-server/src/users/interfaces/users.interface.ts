export interface UpdateUserData {
  password?: string;
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
