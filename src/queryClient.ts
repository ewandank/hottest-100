import { QueryClient } from "@tanstack/solid-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // By Default, don't expire query results.
      staleTime: Infinity,
    },
  },
});
