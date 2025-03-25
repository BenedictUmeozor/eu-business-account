import ENDPOINTS from "@/constants/endpoints";
import useSharedMutationAction from "./use-shared-mutation-action";
import { message } from "antd";
import { getErrorMessage } from "@/utils";
import { useEffect } from "react";

export default function useRemitterPaymentMethods() {
  const mutation = useSharedMutationAction<{
    payment_method: { data: { name: string; code: string }[] };
  }>({
    url: ENDPOINTS.REMITTER_PAYMENT_METHODS,
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  useEffect(() => {
    mutation.mutateAsync({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    paymentMethodsPending: mutation.isPending,
    paymentMethods: mutation.data?.payment_method.data || [],
  };
}
