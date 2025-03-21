import ENDPOINTS from "@/constants/endpoints";
import useSharedMutationAction from "./use-shared-mutation-action";
import { useEffect } from "react";

export default function useCustomerProfile() {
  const mutation = useSharedMutationAction<HM.CustomerProfile>({
    url: ENDPOINTS.GET_CUSTOMER_PROFILE,
  });

  useEffect(() => {
    mutation.mutateAsync({});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    profile: mutation.data,
    isPending: mutation.isPending,
  };
}
