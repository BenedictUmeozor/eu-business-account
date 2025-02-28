import { getErrorMessage } from "@/utils";
import { message } from "antd";
import ENDPOINTS from "@/constants/endpoints";
import useMutationAction from "./use-mutation-action";
import useShareholders from "./use-shareholders";

interface EditShareholderParams {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
  shareholder_token: string;
}

const useEditShareholder = ({
  onSuccess,
  onError,
  shareholder_token,
}: EditShareholderParams) => {
  const { getShareholders } = useShareholders();

  const imageMutation = useMutationAction<unknown>({
    url: ENDPOINTS.UPLOAD_SHAREHOLDER_ID,
    method: "POST",
    mutationKey: ["upload-shareholder-id"],
    onSuccess: () => {
      console.log("image uploaded");
    },
    onError: error => {
      message.error(getErrorMessage(error));
      onError?.(error);
    },
  });

  const formMutation = useMutationAction<unknown>({
    url: ENDPOINTS.EDIT_SHAREHOLDER,
    method: "POST",
    mutationKey: ["edit-shareholder"],
    invalidateQueries: ["get-shareholders"],
    onSuccess: async () => {
      message.success("Shareholder and documents updated successfully");
      onSuccess?.();
    },
    onError: error => {
      message.error(getErrorMessage(error));
      onError?.(error);
    },
  });

  const editShareholder = async (
    formData: any,
    frontImage: File | null,
    backImage: File | null,
    documentType: string
  ) => {
    try {
      await formMutation.mutateAsync(formData);

      if (frontImage) {
        const frontFormData = new FormData();
        frontFormData.append("file", frontImage);
        frontFormData.append("shareholder_token", shareholder_token);
        frontFormData.append("document_type", documentType);
        frontFormData.append("document_side", "Front");
        await imageMutation.mutateAsync(frontFormData);
      }

      if (backImage) {
        const backFormData = new FormData();
        backFormData.append("file", backImage);
        backFormData.append("shareholder_token", shareholder_token);
        backFormData.append("document_type", documentType);
        backFormData.append("document_side", "Back");
        await imageMutation.mutateAsync(backFormData);
      }

      getShareholders()
    } catch (error) {
      console.error("Error editing shareholder:", error);
      throw error;
    }
  };

  return {
    editShareholder,
    isLoading: formMutation.isPending || imageMutation.isPending,
  };
};

export default useEditShareholder;
