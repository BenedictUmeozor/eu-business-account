import ENDPOINTS from "@/constants/endpoints";
import useSharedQueryAction from "./use-shared-query-action";
import { useState, useEffect, useRef, useCallback } from "react";

export const useTransactionData = (type: string) => {
  // Maintain separate page states for each transaction type
  const [pages, setPages] = useState({
    local: 1,
    international: 1,
    conversion: 1,
  });

  // Track previous type to detect changes
  const prevTypeRef = useRef(type);

  // Reset page to 1 when transaction type changes
  useEffect(() => {
    // Only reset if the type actually changed (not on first render)
    if (prevTypeRef.current !== type) {
      setPages(prev => ({
        ...prev,
        [type.toLowerCase()]: 1,
      }));
    }

    // Update the previous type reference
    prevTypeRef.current = type;
  }, [type]);

  // Determine current page based on transaction type
  const currentPage = pages[type.toLowerCase() as keyof typeof pages] || 1;

  let url;
  let key;

  switch (type.toLowerCase()) {
    case "local":
      url = ENDPOINTS.GET_LOCAL_TRANSACTIONS(currentPage, 7);
      key = ["local-transactions", currentPage];
      break;
    case "international":
      url = ENDPOINTS.GET_INTERNATIONAL_TRANSACTIONS(currentPage, 7);
      key = ["international-transactions", currentPage];
      break;
    case "conversion":
      url = ENDPOINTS.GET_CONVERSIONS(currentPage, 7);
      key = ["conversions", currentPage];
      break;
    default:
      url = ENDPOINTS.GET_LOCAL_TRANSACTIONS(currentPage, 7);
      key = ["local-transactions", currentPage];
  }

  const { data, isPending } = useSharedQueryAction<{
    transaction: { data: any[] };
    pagination: HM.Pagination;
  }>({
    url,
    key,
  });

  // Function to update page for the current transaction type
  const updatePage = useCallback(
    (newPage: number) => {
      setPages(prev => ({
        ...prev,
        [type.toLowerCase()]: newPage,
      }));
    },
    [type]
  );

  return {
    data: data?.transaction?.data || [],
    isPending,
    currentPage,
    updatePage,
    pagination: data?.pagination,
  };
};
