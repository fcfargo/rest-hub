import { useAuth } from '@/context/authContext';
import { User } from '@/types';

export function useProtectedUser(): User {
  const { user } = useAuth();

  if (!user) {
    throw new Error('useProtectedUser: user가 없습니다. ProtectedRoute로 감싸주세요');
  }

  return user;
}
