import { queryOptions } from "@tanstack/solid-query";

export const hottestNumberQueryOptions = (num: number) =>
  queryOptions({
    queryKey: ["hottest_number", num],
    queryFn: async () => {
      const res = await fetch(`/numbers/${num}.mp3`);
      if (!res.ok) {
        throw new Error("Fetch for number mp3 died");
      }
      const blob = await res.blob();
      return URL.createObjectURL(blob);
    },
  });
