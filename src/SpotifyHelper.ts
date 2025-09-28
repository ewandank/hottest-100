import { useQueries, useQuery } from "@tanstack/solid-query";
import type {
  Album,
  Artist,
  PlaylistedTrack,
  SpotifyApi,
  TrackItem,
} from "@spotify/web-api-ts-sdk";

/**
 * Hook to fetch and cache the display name for a Spotify user using TanStack Query.
 * @param sdk SpotifyApi instance
 * @param userId Spotify user ID
 * @returns display name or userId if not found
 */
export function useUserDisplayName(
  sdk: SpotifyApi | null,
  userId: string,
) {
  return useQuery(() => ({
    queryKey: ["spotify-user", userId],
    queryFn: fetchUserName(sdk, userId),
    enabled: !!sdk && !!userId,
    staleTime: Infinity,
  }));
}

/**
 * Hook to fetch and cache the display name(s) for a Spotify user using TanStack Query.
 * @param sdk SpotifyApi instance
 * @param userId Spotify user ID
 * @returns display name or userId if not found
 */
export function useUserDisplayNames(
  sdk: SpotifyApi | null,
  userIds: string[],
) {
  return useQueries(() => ({
    queries: userIds.map((id) => ({
      queryKey: ["spotify-user", id],
      queryFn: fetchUserName(sdk, id),
      staleTime: Infinity,
    })),
  }));
}

const fetchUserName = (sdk: SpotifyApi | null, userId: string) => {
  return async () => {
    if (!sdk) return userId;
    const user = await sdk.users.profile(userId);
    return user?.display_name ?? userId;
  };
};

/**
 * A type that actually lines up with the fields I am requesting, no more no less.
 */
export interface ActualPlaylistedTrack
  extends Pick<PlaylistedTrack, "added_by"> {
  track: ActualTrackItem;
}

interface ActualTrackItem
  extends Pick<TrackItem, "duration_ms" | "uri" | "name"> {
  album: Pick<Album, "images" | "release_date">;
  artists: Pick<Artist, "name">[];
}
