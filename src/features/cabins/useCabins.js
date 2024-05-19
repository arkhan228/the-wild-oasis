import { useQuery } from '@tanstack/react-query';
import { getCabins } from '../../services/apiCabins';
import { useSearchParams } from 'react-router-dom';

/**
 * Fetches cabin data using react query and returns the cabins, loading status, and error.
 *
 * @return {object} Object containing cabins data, loading status, and error
 */
export function useCabins() {
  const {
    data: rawCabins,
    isLoading,
    error,
  } = useQuery({ queryKey: ['cabins'], queryFn: getCabins });

  const [searchParams] = useSearchParams();

  const filterValue = searchParams.get('discount') || 'all';

  // 1. Filtering
  let filteredCabins = [];
  if (filterValue === 'all') filteredCabins = rawCabins;
  if (filterValue === 'no-discount')
    filteredCabins = rawCabins?.filter(cabin => cabin.discount === 0);
  if (filterValue === 'with-discount')
    filteredCabins = rawCabins?.filter(cabin => cabin.discount > 0);

  // 2. Sorting
  const sortBy = searchParams.get('sortBy') || 'name-asc';
  const [field, direction] = sortBy.split('-');
  const modifier = direction === 'asc' ? 1 : -1;

  const cabins = filteredCabins?.sort((a, b) =>
    typeof a[field] === 'string'
      ? a[field].localeCompare(b[field]) * modifier
      : (a[field] - b[field]) * modifier
  );

  return { cabins, isLoading, error };
}
