import { useCallback } from "react";

const useStatusStyle = () => {
  const getStatusStyle = useCallback((status: string) => {
    switch (status?.toLowerCase().trim()) {
      case "pending":
      case "processing":
      case "accepted":
        return "text-pending-500 bg-pending-50";
      case "completed":
        return "text-positive bg-positive-50";
      case "declined":
        return "text-negative bg-negative-50";
      case "completedwitherrors":
        return "text-pending-700 bg-pending-50";
      default:
        return "text-positive bg-positive-50";
    }
  }, []);

  return { getStatusStyle };
};

export default useStatusStyle;
