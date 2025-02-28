import { useState, useEffect } from "react";
import { message } from "antd";
import useMutationAction from "./use-mutation-action";
import ENDPOINTS from "@/constants/endpoints";
import { getErrorMessage } from "@/utils";

export const useCompanyTypes = () => {
  const [companyTypes, setCompanyTypes] = useState<HM.CompanyType[]>([]);

  const mutation = useMutationAction<
    HM.QueryResponseWithData<{ data: HM.CompanyType[] }>
  >({
    url: ENDPOINTS.GET_COMPANY_TYPES,
    mutationKey: ["get-company-types"],
    onSuccess: res => {
      setCompanyTypes(res.data.data);
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const fetchCompanyTypes = () => {
    mutation.mutate({});
  };

  useEffect(() => {
    fetchCompanyTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    companyTypes,
    loading: mutation.isPending,
    refetch: fetchCompanyTypes,
  };
};

export default useCompanyTypes;