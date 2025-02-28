import { useEffect, useState } from "react";
import useMutationAction from "./use-mutation-action";
import ENDPOINTS from "@/constants/endpoints";
import { useAppSelector } from ".";
import { message } from "antd";
import { getErrorMessage } from "@/utils";

interface DataType {
  document_id: number;
  document_type: string;
  document_name: string;
  filepath: string;
}

function useUploadedBusinessDocuments() {
  const [uploadedDocuments, setUploadedDocuments] = useState<DataType[]>([]);
  const session = useAppSelector(state => state.session);

  const mutation = useMutationAction<HM.UploadedDocuments>({
    url: ENDPOINTS.FETCH_BUSINESS_DOCUMENTS,
    mutationKey: ["fetch-business-documents", session?.user?.email],
    onSuccess: data => {
      setUploadedDocuments(data.documents?.data || []);
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const fetchUploadedDocs = () => {
    mutation.mutate({});
  };

  useEffect(() => {
    fetchUploadedDocs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    uploadedDocuments,
    fetchUploadedDocs,
  };
}

export default useUploadedBusinessDocuments;
