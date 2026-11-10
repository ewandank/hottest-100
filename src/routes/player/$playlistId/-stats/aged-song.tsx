import { type Component } from "solid-js";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/Card";
import { millisToMinutesAndSeconds } from "~/utils";

import type { StatsComponentProps } from "./types";
type AgedProps = { order: "ascending" | "descending" } & StatsComponentProps;
export const AgedSong: Component<AgedProps> = (props) => {
  const song = () => {
    const tracks = props.tracks;
    if (!tracks || tracks.length === 0) {return undefined;}

    const currentTracks = tracks.slice(props.currentIndex());
    if (!currentTracks || currentTracks.length === 0) {return undefined;}

    // Sort the tracks by duration in descending order and take the first one
    return currentTracks.toSorted((a, b) => {
      // Safely handle potential undefined/null values
      const durationA = a?.track?.duration_ms || 0;
      const durationB = b?.track?.duration_ms || 0;
      if (props.order === "descending") {
        return durationB - durationA; // Descending order (longest first)
      }
      return durationA - durationB;
    })[0];
  };

  return (
    <Card class="col-span-3 h-44">
      <CardHeader>
        <CardTitle>{props.order === "ascending" ? "Shortest" : "Longest"} Song</CardTitle>
      </CardHeader>
      <CardContent>
        {song() !== undefined ? (
          <div class="flex h-full flex-col items-center justify-center">
            <p class="text-2xl font-extrabold text-accent">
              {millisToMinutesAndSeconds(song()!.track.duration_ms)}
            </p>
            <p class="font-bold">{song()!.track.name}</p>
            <p>
              {song()!
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
