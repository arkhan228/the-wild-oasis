import { useQuery } from '@tanstack/react-query';
import { getConfirmedStaysAfterDate } from '../../services/apiBookings';
import { useSearchParams } from 'react-router-dom';
import { subDays } from 'date-fns';

export function useRecentStays() {
  const [searchParams] = useSearchParams();

  const numDays = !searchParams.get('last') ? 7 : +searchParams.get('last');

  const queryDate = subDays(new Date(), numDays).toISOString();

  const { data: confirmedStays, isLoading: isLoadingStays } = useQuery({
    queryFn: () => getConfirmedStaysAfterDate(queryDate),
    queryKey: ['confirmedStays', `last-${numDays}`],
  });

  return { confirmedStays, isLoadingStays, numDays };
}
