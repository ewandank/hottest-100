import { type Component } from "solid-js";
import { Card, CardContent, CardHeader, CardTitle } from "../Card";
import { millisToMinutesAndSeconds } from "../../utils";
import type { StatsComponentProps } from "./types";

export const LongestSong: Component<StatsComponentProps> = (props) => {
  const longestSong = () => {
    const tracks = props.tracks();
    if (!tracks || tracks.length === 0) return undefined;

    const currentTracks = tracks.slice(props.currentIndex());
    if (!currentTracks || currentTracks.length === 0) return undefined;

    // Sort the tracks by duration in descending order and take the first one
    return currentTracks.toSorted((a, b) => {
      // Safely handle potential undefined/null values
      const durationA = a?.track?.duration_ms || 0;
      const durationB = b?.track?.duration_ms || 0;
      return durationB - durationA; // Descending order (longest first)
    })[0];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Longest Song</CardTitle>
      </CardHeader>
      <CardContent class="text-center text-3xl font-bold">
        {longestSong() !== undefined ? (
          <>
            <p>
              {(longestSong()!.track.artists as { name: string }[])
                .map((artist) => artist.name)
                .join(",")}
            </p>
            <p class="">"{longestSong()!.track.name}"</p>
            <p class="text-center font-extrabold text-blue-500">
              {millisToMinutesAndSeconds(longestSong()!.track.duration_ms)}
            </p>
          </>
        ) : (
          <p class="text-base font-normal">No songs available</p>
        )}
      </CardContent>
    </Card>
  );
};
