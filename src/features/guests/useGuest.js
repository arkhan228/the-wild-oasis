import { useQuery } from '@tanstack/react-query';
import { getGuest } from '../../services/apiGuests';
import { useParams } from 'react-router-dom';

export function useGuest() {
  const { guestId } = useParams();

  const { data: guest, isLoading: isLoadingGuest } = useQuery({
    queryFn: () => getGuest(guestId),
    queryKey: ['guest', guestId],
    retry: false,
  });

  return { guest, isLoadingGuest };
}
