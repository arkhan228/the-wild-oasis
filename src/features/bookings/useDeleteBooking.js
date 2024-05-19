import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBooking as deleteBookingApi } from '../../services/apiBookings';
import toast from 'react-hot-toast';

export function useDeleteBooking() {
  const queryClient = useQueryClient();

  const { mutate: deleteBooking, isLoading: isDeleting } = useMutation({
    mutationFn: deleteBookingApi,

    onSuccess: data => {
      toast.success(`Booking #${data.id} successfully deleted`);
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },

    onError: err => toast.error(err.message),
  });

  return { deleteBooking, isDeleting };
}
