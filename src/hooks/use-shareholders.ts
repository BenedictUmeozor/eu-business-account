import { useCallback, useState } from "react";
import useMutationAction from "./use-mutation-action";
import ENDPOINTS from "@/constants/endpoints";
import { getErrorMessage } from "@/utils";
import { message } from "antd";

/**
 * Hook to fetch shareholders
 */
const useShareholders = () => {
  const [shareholders, setShareholders] = useState<HM.Shareholder[]>([]);
  const [isProcessing, setIsProcessing] = useState(true);

  const mutation = useMutationAction<HM.ShareholderResponse>({
    url: ENDPOINTS.GET_SHAREHOLDERS,
    method: "POST",
    mutationKey: ["get-shareholders"],
    onSuccess: data => {
      setShareholders(data.shareholder?.data || []);
      setIsProcessing(false);
    },
    onError: error => {
      message.error(getErrorMessage(error));
      setIsProcessing(false);
    },
  });

  const getShareholders = useCallback(async () => {
    setIsProcessing(true);
    await mutation.mutateAsync({});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    shareholders: shareholders?.reverse(),
    isLoading: isProcessing || mutation.isPending,
    getShareholders,
  };
};

export default useShareholders;
