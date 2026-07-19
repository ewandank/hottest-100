import type { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { queryOptions } from "@tanstack/solid-query";

export function userDisplayNameQueryOptions(sdk: SpotifyApi | undefined, userId: string) {
  return queryOptions({
    queryKey: ["spotify-user", userId],
    queryFn: async () => {
      if (!sdk) return userId;
      const user = await sdk.users.profile(userId);
      return user?.display_name ?? userId;
    },
    enabled: !!sdk && !!userId,
  });
}
