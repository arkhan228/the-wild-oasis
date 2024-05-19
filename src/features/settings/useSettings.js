import { useQuery } from '@tanstack/react-query';
import { getSettings } from '../../services/apiSettings';

/**
 * Function to use settings.
 *
 * @return {object} The settings, isLoading, and error.
 */
export function useSettings() {
  const {
    data: settings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  });
  return { settings, isLoading, error };
}
