import useQueryAction from "./use-query-action";
import ENDPOINTS from "@/constants/endpoints";

/**
 * Hook to fetch business details
 */
export const useBusinessTransactionDetails = (email?: string) => {
  const { data, isPending, error, refetch } =
    useQueryAction<HM.BusinessTransactionDetails>({
      url: ENDPOINTS.FETCH_BUSINESS_TRANSACTION_DETAILS,
      key: ["business-transaction-details", email],
    });

  return {
    businessTransactionDetails: data,
    isLoading: isPending,
    error,
    refetch,
  };
};

export default useBusinessTransactionDetails;
