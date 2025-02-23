import { sharedApi } from "@/lib/axios";
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { useMemo, useCallback } from "react";

type HttpMethod = "POST" | "PUT" | "PATCH" | "DELETE";

interface MutationConfig<TData, TVariables>
  extends Omit<
    UseMutationOptions<TData, AxiosError, TVariables>,
    "mutationFn"
  > {
  url: string;
  method?: HttpMethod;
  invalidateQueries?: string[];
}

function useSharedMutationAction<TData = unknown, TVariables = unknown>({
  url,
  method = "POST",
  invalidateQueries = [],
  onSuccess,
  onError,
  ...options
}: MutationConfig<TData, TVariables>) {
  const queryClient = useQueryClient();

  const mutationFn = useCallback(async (variables: TVariables) => {
    const response: AxiosResponse<TData> = await sharedApi.request({
      url,
      method,
      data: variables,
    });

    if (response.status >= 400) {
      throw new Error((response.data as HM.QueryResponse).message);
    }

    return response.data;
  }, [url, method]);

  const mutationOptions = useMemo(() => ({
    onSuccess: async (data: TData, variables: TVariables, context: unknown) => {
      if (invalidateQueries.length > 0) {
        await Promise.all(
          invalidateQueries.map(query =>
            queryClient.invalidateQueries({ queryKey: [query] })
          )
        );
      }

      onSuccess?.(data, variables, context);
    },
    onError: (error: AxiosError, variables: TVariables, context: unknown) => {
      onError?.(error, variables, context);
    },
    ...options,
  }), [queryClient, invalidateQueries, onSuccess, onError, options]);

  return useMutation<TData, AxiosError, TVariables>({
    mutationFn,
    ...mutationOptions,
  });
}

export type MutationResult<TData> =
  | {
      data: TData;
      error: null;
    }
  | {
      data: null;
      error: AxiosError;
    };

export default useSharedMutationAction;
