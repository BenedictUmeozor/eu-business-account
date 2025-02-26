import { useState, useEffect } from "react";
import { message } from "antd";
import useMutationAction from "./use-mutation-action";
import ENDPOINTS from "@/constants/endpoints";
import { getErrorMessage } from "@/utils";

export const useDocumentTypes = () => {
  const [documentTypes, setDocumentTypes] = useState<HM.DocumentType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const mutation = useMutationAction<
    HM.QueryResponseWithData<{ data: HM.DocumentType[] }>
  >({
    url: ENDPOINTS.GET_DOCUMENT_TYPES,
    mutationKey: ["get-document-types"],
    onSuccess: res => {
      setDocumentTypes(res.data.data);
      setLoading(false);
    },
    onError: error => {
      message.error(getErrorMessage(error));
      setLoading(false);
    },
  });

  const fetchDocumentTypes = () => {
    setLoading(true);
    mutation.mutate({});
  };

  useEffect(() => {
    fetchDocumentTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    documentTypes,
    loading,
    refetch: fetchDocumentTypes,
  };
};

export default useDocumentTypes;