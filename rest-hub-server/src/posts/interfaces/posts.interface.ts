import { User } from '@/model/user.entity';

export interface CreatePostRequest {
  content: string;
  imageUrl?: string;
  user: User;
  location?: string;
}
