import { useCallback, useState } from "react";
import { message } from "antd";
import useMutationAction from "./use-mutation-action";
import ENDPOINTS from "@/constants/endpoints";
import { getErrorMessage } from "@/utils";

export const useBusinessDocumentTypes = () => {
  const [businessDocumentTypes, setBusinessDocumentTypes] = useState<
    HM.DocumentType[]
  >([]);

  const mutation = useMutationAction<
    HM.QueryResponseWithData<{ data: HM.DocumentType[] }>
  >({
    url: ENDPOINTS.GET_BUSINESS_DOCUMENT_TYPES,
    mutationKey: ["get-business-document-types"],
    onSuccess: res => {
      setBusinessDocumentTypes(res.data.data);
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const fetchBusinessDocumentTypes = useCallback((code: string) => {
    mutation.mutate({ company_type_code: code });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading: mutation.isPending,
    fetch: fetchBusinessDocumentTypes,
    businessDocumentTypes,
  };
};

export default useBusinessDocumentTypes;
