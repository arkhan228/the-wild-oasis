import { useLocation, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getGuests } from '../../services/apiGuests';
import { PAGE_SIZE } from '../../utils/constants';

export function useGuests() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  // To check if we are on the guests page
  const location = useLocation();

  let filter, sortBy, page;

  // Only do filtering, sorting and pagination if on the guests page
  if (location.pathname === '/guests') {
    const filterValue = searchParams.get('bookings') || 'all';

    filter =
      !filterValue || filterValue === 'all'
        ? null
        : { field: 'bookings.status', value: filterValue };

    const sortByValue = searchParams.get('sortBy') || 'fullName-asc';
    const [field, direction] = sortByValue.split('-');

    sortBy = { field, direction };

    page = +searchParams.get('page') || 1;
  }

  const { data: { data: guests, count } = {}, isLoading } = useQuery({
    queryFn: () => getGuests(filter, sortBy, page),
    queryKey: ['guests', filter, sortBy, page],
  });

  const pageCount = Math.ceil(count / PAGE_SIZE);

  if (page < pageCount) {
    queryClient.prefetchQuery({
      queryKey: ['guests', filter, sortBy, page + 1],
      queryFn: () => getGuests(filter, sortBy, page + 1),
    });
  }

  if (page > 1) {
    queryClient.prefetchQuery({
      queryKey: ['guests', filter, sortBy, page - 1],
      queryFn: () => getGuests(filter, sortBy, page - 1),
    });
  }

  return { guests, isLoading, count, pageCount };
}
