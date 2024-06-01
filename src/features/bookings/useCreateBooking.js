import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBooking as createBookingApi } from '../../services/apiBookings';
import toast from 'react-hot-toast';

export function useCreateBooking() {
  const queryClient = useQueryClient();

  const {
    mutate: createBooking,
    isLoading: isCreatingBooking,
    error,
  } = useMutation({
    mutationFn: createBookingApi,
    mutationKey: ['booking'],

    onSuccess: () => {
      toast.success('Booking successfully created!');

      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },

    onError: err => toast.error(err.message),
  });

  return { createBooking, isCreatingBooking, error };
}
