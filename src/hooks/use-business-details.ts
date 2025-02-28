import useQueryAction from "./use-query-action";
import ENDPOINTS from "@/constants/endpoints";

/**
 * Hook to fetch business details
 */
export const useBusinessDetails = (email?: string) => {
  const { data, isPending, error, refetch } =
    useQueryAction<HM.BusinessDetails>({
      url: ENDPOINTS.FETCH_BUSINESS_DETAILS,
      key: ["business-details", email],
    });

  return {
    businessDetails: data,
    isLoading: isPending,
    error,
    refetch,
  };
};

export default useBusinessDetails;
