import ENDPOINTS from "@/constants/endpoints";
import useSharedMutationAction from "./use-shared-mutation-action";
import { message } from "antd";
import { getErrorMessage } from "@/utils";
import { useEffect } from "react";

export default function useRemitterDeliveryMethods() {
  const mutation = useSharedMutationAction<{
    delivery_method: { data: { name: string; code: string }[] };
  }>({
    url: ENDPOINTS.REMITTER_DELIVERY_METHODS,
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  useEffect(() => {
    mutation.mutateAsync({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    deliveryMethodsPending: mutation.isPending,
    deliveryMethods: mutation.data?.delivery_method.data || [],
  };
}
