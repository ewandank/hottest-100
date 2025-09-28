import { useQuery } from "@tanstack/solid-query";
import type { SpotifyApi } from "@spotify/web-api-ts-sdk";

/**
 * Hook to fetch and cache the display name for a Spotify user using TanStack Query.
 * @param sdk SpotifyApi instance
 * @param userId Spotify user ID
 * @returns display name or userId if not found
 */
export function useUserDisplayName(
  sdk: SpotifyApi | undefined,
  userId: string,
) {
  return useQuery(() => ({
    queryKey: ["spotify-user", userId],
    queryFn: async () => {
      if (!sdk) return userId;
      const user = await sdk.users.profile(userId);
      return user?.display_name ?? userId;
    },
    enabled: !!sdk && !!userId,
  }));
}
