import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createUpdateCabin } from '../../services/apiCabins';

/**
 * A custom hook that creates a new cabin using react-query.
 *
 * @return {Object} Object containing the createCabin function and a boolean indicating if it's currently creating a cabin.
 */
export function useCreateCabin() {
  // query client for invalidating queries to refetch data
  const queryClient = useQueryClient();

  // Use react-query to create a new cabin
  const { mutate: createCabin, isLoading: isCreating } = useMutation({
    mutationFn: createUpdateCabin,
    onSuccess: () => {
      toast.success('New cabin successfully created');
      queryClient.invalidateQueries({
        queryKey: ['cabins'],
      });
    },
    onError: err => toast.error(err.message),
  });

  return { createCabin, isCreating };
}
