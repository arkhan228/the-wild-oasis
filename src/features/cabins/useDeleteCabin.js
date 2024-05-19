import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deleteCabin as deleteCabinApi } from '../../services/apiCabins';

/**
 * A custom hook that deletes an existing cabin using react-query.
 * @return {Object} Object containing the deleteCabin function and isDeleting state boolean
 */
export function useDeleteCabin() {
  // query client for invalidating queries to refetch data
  const queryClient = useQueryClient();

  // Use react-query to delete an existing cabin
  const { mutate: deleteCabin, isLoading: isDeleting } = useMutation({
    mutationFn: ({ cabinId, image, isDuplicated }) =>
      deleteCabinApi(cabinId, image, isDuplicated),
    onSuccess: () => {
      toast.success('Cabin successfully deleted');

      queryClient.invalidateQueries({
        queryKey: ['cabins'],
      });
    },

    onError: err => toast.error(err.message),
  });

  return { deleteCabin, isDeleting };
}
