import { message } from "antd";
import useMutationAction from "./use-mutation-action";
import ENDPOINTS from "@/constants/endpoints";
import { getErrorMessage } from "@/utils";
import { useAppSelector } from ".";
import { useCallback } from "react";

// ProgressData interface for shareholder document progress
export interface ShareholderProgressData {
  shareholder: string;
  shareholder_document: string;
}

const useShareholderProgress = (email?: string) => {
  const session = useAppSelector(state => state.session);

  const checkShareholderProgress = useMutationAction<
    HM.QueryResponseWithData<ShareholderProgressData>
  >({
    url: ENDPOINTS.ONBOARDING_PROGRESS,
    mutationKey: ["shareholder-progress", email],
    method: "POST",
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const getShareholderProgress = useCallback(async () => {
    try {
      const response = await checkShareholderProgress.mutateAsync({
        business_token: session.business?.business_token,
      });
      if (response?.data) {
        return {
          shareholderCreated: Number(response.data.shareholder) === 1,
          shareholderDocumentComplete:
            Number(response.data.shareholder_document) === 1,
        };
      }
      return {
        shareholderCreated: false,
        shareholderDocumentComplete: false,
      };
    } catch {
      return {
        shareholderCreated: false,
        shareholderDocumentComplete: false,
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.business?.business_token]);

  return {
    getShareholderProgress,
    isChecking: checkShareholderProgress.isPending,
  };
};

export default useShareholderProgress;
