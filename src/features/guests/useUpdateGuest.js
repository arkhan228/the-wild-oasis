import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateGuest as updateGuestApi } from '../../services/apiGuests';
import toast from 'react-hot-toast';

export function useUpdateGuest() {
  const queryClient = useQueryClient();

  const { mutate: updateGuest, isLoading: isUpdating } = useMutation({
    mutationFn: updateGuestApi,

    onSuccess: () => {
      toast.success('Guest successfully updated!');
      queryClient.invalidateQueries({ queryKey: ['guests'] });
    },

    onError: error => toast.error(error.message),
  });

  return { updateGuest, isUpdating };
}
