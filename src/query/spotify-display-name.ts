import type { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { queryOptions } from "@tanstack/solid-query";

export function userDisplayNameQueryOptions(sdk: SpotifyApi | null, userId: string) {
  return queryOptions({
    queryKey: ["spotify-user", userId],
    queryFn: fetchUserName(sdk, userId),
    enabled: !!sdk && !!userId,
  });
}

const fetchUserName = (sdk: SpotifyApi | null, userId: string) => {
  return async () => {
    if (!sdk) return userId;
    const user = await sdk.users.profile(userId);
    return user?.display_name ?? userId;
  };
};
