import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createUpdateCabin } from '../../services/apiCabins';
/**
 * A custom hook to update a cabin using react-query.
 *
 * @return {Object} Object containing the updateCabin function and a boolean flag indicating if the update is in progress.
 */
export function useUpdateCabin() {
  // query client for invalidating queries to refetch data
  const queryClient = useQueryClient();

  // Use react-query to edit an existing cabin
  const { mutate: updateCabin, isLoading: isUpdating } = useMutation({
    // Mutation function only takes one argument so we pass parameters in an object and destructure it
    mutationFn: ({ newCabinData, id, currentImage }) =>
      createUpdateCabin(newCabinData, id, currentImage),

    onSuccess: () => {
      toast.success('Cabin successfully updated');
      queryClient.invalidateQueries({
        queryKey: ['cabins'],
      });
    },

    onError: err => toast.error(err.message),
  });

  return { updateCabin, isUpdating };
}
