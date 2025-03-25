import ENDPOINTS from "@/constants/endpoints";
import useSharedQueryAction from "./use-shared-query-action";

export default function useRemitterTransferPurpose() {
  const { data, isPending } = useSharedQueryAction<{
    transfer_purpose: { data: { name: string; code: string }[] };
  }>({
    url: ENDPOINTS.REMITTER_TRANSFER_PURPOSE,
  });

  return {
    transferPurposePending: isPending,
    transferPurpose: data?.transfer_purpose.data || [],
  };
}
