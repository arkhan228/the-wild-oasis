import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createGuest as createGuestApi } from '../../services/apiGuests';
import toast from 'react-hot-toast';

export function useCreateGuest() {
  const queryClient = useQueryClient();

  const {
    mutate: createGuest,
    isLoading: isCreatingGuest,
    error,
  } = useMutation({
    mutationFn: createGuestApi,
    queryKey: ['guest'],

    onSuccess: () => {
      toast.success('Guest successfully created!');
      queryClient.invalidateQueries({ queryKey: ['guests'] });
    },

    onError: error => toast.error(error.message),
  });

  return { createGuest, isCreatingGuest, error };
}
