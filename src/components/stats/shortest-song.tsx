import { type Component } from "solid-js";
import { Card, CardContent, CardHeader, CardTitle } from "../Card";
import { millisToMinutesAndSeconds } from "../../utils";
import type { StatsComponentProps } from "./types";

export const ShortestSong: Component<StatsComponentProps> = (props) => {
  const shortestSong = () => {
    const tracks = props.tracks();
    if (!tracks || tracks.length === 0) return undefined;

    const currentTracks = tracks.slice(props.currentIndex());
    if (!currentTracks || currentTracks.length === 0) return undefined;

    // Sort the tracks by duration in ascending order and take the first one
    return currentTracks.sort((a, b) => {
      const durationA = a.track.duration_ms;
      const durationB = b.track.duration_ms;
      return durationA - durationB; // Ascending order (shortest first)
    })[0];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shortest Song</CardTitle>
      </CardHeader>
      <CardContent class="text-center text-3xl font-bold">
        {shortestSong() !== undefined ? (
          <>
            <p>
              {shortestSong()!
                .track.artists.map((artist) => artist.name)
                .join(",")}
            </p>
            <p class="">"{shortestSong()!.track.name}"</p>
            <p class="text-center font-extrabold text-blue-500">
              {millisToMinutesAndSeconds(shortestSong()!.track.duration_ms)}
            </p>
          </>
        ) : (
          <p class="text-base font-normal">No songs available</p>
        )}
      </CardContent>
    </Card>
  );
};
