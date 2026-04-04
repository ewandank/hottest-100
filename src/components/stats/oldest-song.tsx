import { type Component } from "solid-js";
import { Card, CardContent, CardHeader, CardTitle } from "../Card";
import type { StatsComponentProps } from "./types";
import { formatDate } from "./newest-song";

export const OldestSong: Component<StatsComponentProps> = (props) => {
  const oldestSong = () => {
    const tracks = props.tracks();
    if (!tracks || tracks.length === 0) return undefined;

    const currentTracks = tracks.slice(props.currentIndex());
    if (!currentTracks || currentTracks.length === 0) return undefined;

    // Sort the tracks by release date in ascending order (oldest first)
    return currentTracks.toSorted((a, b) => {
      const dateA = a.track.album.release_date || "";
      const dateB = b.track.album.release_date || "";
      // Compare dates in string form since they're in YYYY-MM-DD format
      return dateA.localeCompare(dateB);
    })[0];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Oldest Song</CardTitle>
      </CardHeader>
      <CardContent>
        {oldestSong() !== undefined ? (
          <div class="flex h-full flex-col items-center justify-center">
            <p class="text-2xl font-extrabold">
              {formatDate(oldestSong()!.track.album.release_date)}
            </p>
            <p class="font-bold">{oldestSong()!.track.name}</p>
            <p>
              {oldestSong()!
                .track.artists.map((artist) => artist.name)
                .join(", ")}
            </p>
          </div>
        ) : (
          <p>No songs available</p>
        )}
      </CardContent>
    </Card>
  );
};
