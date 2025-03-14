import { useEffect, useState } from "react";
import useSharedMutationAction from "./use-shared-mutation-action";
import ENDPOINTS from "@/constants/endpoints";
import { message } from "antd";
import { getErrorMessage } from "@/utils";

function useNgBanks() {
  const [banks, setBanks] = useState<HM.Bank[]>([]);

  const mutation = useSharedMutationAction<{ data: { bank: HM.Bank[] } }>({
    url: ENDPOINTS.BANK_LIST,
    onSuccess: data => {
      setBanks(data.data.bank);
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  useEffect(() => {
    mutation.mutateAsync({});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { banks, loading: mutation.isPending };
}

export default useNgBanks;
