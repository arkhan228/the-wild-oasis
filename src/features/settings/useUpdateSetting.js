import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { updateSetting as updateSettingApi } from '../../services/apiSettings';

/**
 * A custom hook to update a setting using react query mutation and handle success scenario.
 *
 * @return {Object} Object containing updateSetting function and isUpdating state boolean
 */
export function useUpdateSetting() {
  const queryClient = useQueryClient();

  const { mutate: updateSetting, isLoading: isUpdating } = useMutation({
    mutationFn: updateSettingApi,
    onSuccess: () => {
      toast.success('Settings successfully updated');
      queryClient.invalidateQueries({
        queryKey: ['settings'],
      });
    },
  });

  return { updateSetting, isUpdating };
}
