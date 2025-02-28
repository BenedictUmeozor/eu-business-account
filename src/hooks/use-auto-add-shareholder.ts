import { useState, useEffect } from "react";
import ENDPOINTS from "@/constants/endpoints";
import { message } from "antd";
import { getErrorMessage } from "@/utils";
import useMutationAction from "./use-mutation-action";
import usePersonalDetails from "./use-personal-details";
import useShareholders from "./use-shareholders";

interface UseAutoAddShareholderProps {
  email: string | undefined;
  isReview?: boolean;
}

const useAutoAddShareholder = ({ email, isReview = false }: UseAutoAddShareholderProps) => {
  const [autoAddedShareholder, setAutoAddedShareholder] = useState(false);

  // Fetch personal details to check percentage stake
  const { personalDetails, isLoading: isLoadingPersonalDetails } = usePersonalDetails(email);

  // Use the shareholders hook
  const { shareholders, getShareholders } = useShareholders();

  // Add shareholder mutation
  const addShareholderMutation = useMutationAction<{
    shareholder_token: string;
  }>({
    url: ENDPOINTS.ADD_SHAREHOLDER,
    method: "POST",
    mutationKey: ["add-shareholder"],
    invalidateQueries: ["get-shareholders"],
    onSuccess: () => {
      message.success("You have been automatically added as a shareholder");
      setAutoAddedShareholder(true);
      getShareholders();
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  // Check if user has 100% stake and auto-add them as shareholder
  useEffect(() => {
    if (
      !isLoadingPersonalDetails &&
      personalDetails &&
      !autoAddedShareholder &&
      shareholders.length === 0
    ) {
      const percentageStake = Number(personalDetails.percentage_stake);

      if (percentageStake === 100 && !isReview && shareholders.length === 0) {
        const formData = {
          fname: personalDetails.fname,
          lname: personalDetails.lname,
          email: email || "",
          type: "Individual",
          residential_address: personalDetails.address || "",
          region: personalDetails.city || "",
          postcode: personalDetails.postcode || "",
          business_stake: "YES",
          business_role: "Shareholder",
          authorized_signatory: personalDetails.authorized_signatory || "YES",
        };

        addShareholderMutation.mutate(formData);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    personalDetails,
    isLoadingPersonalDetails,
    shareholders.length,
    autoAddedShareholder,
    email,
    isReview,
  ]);

  return {
    autoAddedShareholder,
    isLoading: isLoadingPersonalDetails || addShareholderMutation.isPending,
  };
};

export default useAutoAddShareholder;