import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deleteGuest as deleteGuestApi } from '../../services/apiGuests';

export function useDeleteGuest() {
  const queryClient = useQueryClient();

  const {
    mutate: deleteGuest,
    isLoading: isDeleting,
    error,
  } = useMutation({
    mutationFn: deleteGuestApi,

    onSuccess: () => {
      toast.success('Guest successfully deleted!');
      queryClient.invalidateQueries({ queryKey: ['guests'] });
    },

    onError: error => toast.error(error.message),
  });

  return { deleteGuest, isDeleting, error };
}
