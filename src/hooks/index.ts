import { AppDispatch, RootState } from "@/lib/redux/store";
import { useDispatch, useSelector } from "react-redux";
import useAutoAddShareholder from "./use-auto-add-shareholder";
import useDelay from "./use-delay";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export { useAutoAddShareholder, useDelay };
