import { queryOptions } from "@tanstack/solid-query";
import type {
  Album,
  Artist,
  PlaylistedTrack,
  SpotifyApi,
  TrackItem,
} from "@spotify/web-api-ts-sdk";


export function userDisplayNameQueryOptions(sdk: SpotifyApi | null, userId: string) {
  return queryOptions({
    queryKey: ["spotify-user", userId],
    queryFn: fetchUserName(sdk, userId),
    enabled: !!sdk && !!userId,
    staleTime: Infinity,
  });
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
export interface ActualPlaylistedTrack extends Pick<PlaylistedTrack, "added_by"> {
  track: ActualTrackItem;
}

interface ActualTrackItem extends Pick<TrackItem, "duration_ms" | "uri" | "name"> {
  album: Pick<Album, "images" | "release_date">;
  artists: Pick<Artist, "name">[];
}
