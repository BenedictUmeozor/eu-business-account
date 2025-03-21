import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useMemo } from "react";
import api from "../lib/axios";

interface QueryConfig<TData>
  extends Omit<
    UseQueryOptions<TData, AxiosError, TData>,
    "queryKey" | "queryFn"
  > {
  url: string;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

function useQueryAction<TData>({
  url,
  params,
  headers,
  enabled = true,
  retry = 1,
  staleTime = 1000 * 60 * 5, // 5 minutes
  gcTime = 1000 * 60 * 30, // 30 minutes
  key,
  ...options
}: QueryConfig<TData> & {
  key?:
    | string
    | {
        [key: string]: any;
      }
    | undefined[];
}) {
  const queryKey = useMemo(() => 
    Array.isArray(key) ? key : key ? [key] : [url, params]
  , [key, url, params]);

  return useQuery<TData, AxiosError, TData>({
    queryKey,
    queryFn: async () => {
      const { data } = await api.get<TData>(url, { params, headers });
      return data;
    },
    enabled,
    retry,
    staleTime,
    gcTime,
    ...options,
  });
}

export default useQueryAction;
