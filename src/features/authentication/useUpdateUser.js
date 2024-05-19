import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCurrentUser } from '../../services/apiAuth';
import toast from 'react-hot-toast';

export function useUpdateUser() {
  const queryClient = useQueryClient();

  const { mutate: updateUser, isLoading: isUpdatingUser } = useMutation({
    mutationFn: updateCurrentUser,

    onSuccess: () => {
      toast.success('User account successfully updated!');
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },

    onError: error => toast.error(error.message),
  });

  return { updateUser, isUpdatingUser };
}
