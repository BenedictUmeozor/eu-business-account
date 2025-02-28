import useQueryAction from './use-query-action';
import ENDPOINTS from '@/constants/endpoints';

/**
 * Hook to fetch personal details
 */
export const usePersonalDetails = (email?: string) => {
  const { data, isPending, error, refetch } = useQueryAction<HM.PersonalDetails>({
    url: ENDPOINTS.FETCH_PERSONAL_INFORMATION,
    key: ["personal_details", email],
  });

  return {
    personalDetails: data,
    isLoading: isPending,
    error,
    refetch
  };
};

export default usePersonalDetails;