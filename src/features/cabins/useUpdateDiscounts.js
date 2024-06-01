import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateDiscounts as updateDiscountsApi } from '../../services/apiCabins';
import toast from 'react-hot-toast';

function useUpdateDiscounts() {
  const queryClient = useQueryClient();

  const { mutate: updateDiscounts, isLoading: isUpdating } = useMutation({
    mutationFn: updateDiscountsApi,

    onSuccess: data => {
      console.log(data);
      toast.success('Discount successfully updated!');

      queryClient.invalidateQueries({
        queryKey: ['cabins'],
      });
    },

    onError: error => toast.error(error.message),
  });
  return { updateDiscounts, isUpdating };
}

export default useUpdateDiscounts;
