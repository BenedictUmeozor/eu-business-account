import { UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import api from '../lib/axios';

type HttpMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface MutationConfig<TData, TVariables> extends Omit<
  UseMutationOptions<TData, AxiosError, TVariables>,
  'mutationFn'
> {
  url: string;
  method?: HttpMethod;
  invalidateQueries?: string[];
}

function useMutationAction<TData = unknown, TVariables = unknown>({
  url,
  method = 'POST',
  invalidateQueries = [],
  onSuccess,
  onError,
  ...options
}: MutationConfig<TData, TVariables>) {
  const queryClient = useQueryClient();

  return useMutation<TData, AxiosError, TVariables>({
    mutationFn: async (variables) => {
      const response: AxiosResponse<TData> = await api.request({
        url,
        method,
        data: variables,
      });

      if (response.status >= 400) {
        throw new Error(response.statusText);
      }

      return response.data;
    },
    onSuccess: async (data, variables, context) => {
      if (invalidateQueries.length > 0) {
        await Promise.all(
          invalidateQueries.map((query) =>
            queryClient.invalidateQueries({ queryKey: [query] })
          )
        );
      }

      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error('Mutation error:', error);
      onError?.(error, variables, context);
    },
    ...options,
  });
}

export type MutationResult<TData> = {
  data: TData;
  error: null;
} | {
  data: null;
  error: AxiosError;
};

export default useMutationAction;
