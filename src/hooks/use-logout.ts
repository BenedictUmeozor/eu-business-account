import { useNavigate } from "react-router";
import { useAppDispatch } from ".";
import { clearSession } from "@/lib/redux/slices/session";
import { useState } from "react";
import { delay } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";

function useLogout() {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logout = async () => {
    setLoading(true);
    await delay(2000);
    // Clear all queries first before removing the session
    queryClient.clear();
    dispatch(clearSession());
    navigate("/login");
    setLoading(false);
  };

  return { logout, loading };
}

export default useLogout;
