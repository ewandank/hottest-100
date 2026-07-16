import type { Album, Artist, PlaylistedTrack, TrackItem } from "@spotify/web-api-ts-sdk";

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
