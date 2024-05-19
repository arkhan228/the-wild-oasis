import { useQuery } from '@tanstack/react-query';
import { getCabin } from '../../services/apiCabins';

export function useCabin(cabinId) {
  const { data: cabin, isLoading: isLoadingCabin } = useQuery({
    queryFn: () => getCabin(cabinId),
    queryKey: ['cabin', cabinId],
  });

  return { cabin, isLoadingCabin };
}
