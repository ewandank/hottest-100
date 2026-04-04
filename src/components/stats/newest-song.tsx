import { type Component } from "solid-js";
import { Card, CardContent, CardHeader, CardTitle } from "../Card";
import type { StatsComponentProps } from "./types";

// Helper function to convert YYYY-MM-DD date to DD/MM/YYYY format
export const formatDate = (dateStr: string): string => {
  if (!dateStr) return "";

  // Check if the date is in the YYYY-MM-DD format
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [, year, month, day] = match;
    return `${day}/${month}/${year}`;
  }

  // If it's only YYYY format or any other format, return as is
  return dateStr;
};

export const NewestSong: Component<StatsComponentProps> = (props) => {
  const newestSong = () => {
    const tracks = props.tracks();
    if (!tracks || tracks.length === 0) return undefined;

    const currentTracks = tracks.slice(props.currentIndex());
    if (!currentTracks || currentTracks.length === 0) return undefined;

    // Sort the tracks by release date in descending order (newest first)
    return currentTracks.toSorted((a, b) => {
      const dateA = a.track.album.release_date || "";
      const dateB = b.track.album.release_date || "";
      // Compare dates in string form since they're in YYYY-MM-DD format
      return dateB.localeCompare(dateA);
    })[0];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Newest Song</CardTitle>
      </CardHeader>
      <CardContent>
        {newestSong() !== undefined ? (
          <div class="flex h-full flex-col items-center justify-center">
            <p class="text-2xl font-extrabold">
              {formatDate(newestSong()!.track.album.release_date)}
            </p>
            <p class="font-bold">{newestSong()!.track.name}</p>
            <p>
              {newestSong()!
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
