import { useQuery } from '@tanstack/react-query';
import { getUser } from '../../services/apiAuth';

export function useUser() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
  });

  return {
    user,
    isLoading,
    isAuthenticated: user?.role === 'authenticated',
  };
}
