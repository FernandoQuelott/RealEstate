import { useQuery, type QueryKey, type UseQueryResult } from "@tanstack/react-query";

interface UseRetryableQueryOptions<TData> {
  queryKey: QueryKey;
  queryFn: () => Promise<TData>;
}

export const useRetryableQuery = <TData,>({
  queryKey,
  queryFn
}: UseRetryableQueryOptions<TData>): UseQueryResult<TData, Error> => {
  return useQuery<TData, Error>({
    queryKey,
    queryFn,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    retry: (failureCount, error) => {
      if (error.message.toLowerCase().includes("unauthorized")) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000)
  });
};
