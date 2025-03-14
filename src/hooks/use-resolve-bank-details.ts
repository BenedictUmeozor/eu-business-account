import { useState } from "react";
import useSharedMutationAction from "./use-shared-mutation-action";
import ENDPOINTS from "@/constants/endpoints";
import { getErrorMessage } from "@/utils";
import { message } from "antd";

function useResolveBankDetails() {
  const [data, setData] = useState<HM.ResolveBankData>();

  const mutation = useSharedMutationAction<HM.ResolveBankData>({
    url: ENDPOINTS.RESOLVE_BANK_DETAILS,
    onSuccess: data => {
      setData(data);
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const resolveBankDetails = async (
    account_number: string,
    bank_code: string
  ) => {
    setData(undefined);
    await mutation.mutateAsync({ account_number, bank_code });
  };

  return { data, resolveBankDetails, loading: mutation.isPending };
}

export default useResolveBankDetails;
