import type { Component } from "solid-js";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/Card";
import type { ActualPlaylistedTrack } from "~/types/spotify";

import type { StatsComponentProps } from "./types";

type ExtremeSongProps = StatsComponentProps & {
  order: "asc" | "desc";
  title: string;
  sortFn: (a: ActualPlaylistedTrack, b: ActualPlaylistedTrack) => number;
  displayFn: (track: ActualPlaylistedTrack) => string;
};

export const ExtremeSong: Component<ExtremeSongProps> = (props) => {
  const song = () => {
    const tracks = props.tracks?.slice(props.currentIndex()) ?? [];

    return tracks.toSorted((a, b) =>
      props.order === "asc" ? props.sortFn(a, b) : props.sortFn(b, a),
    )[0];
  };

  return (
    <Card class="col-span-3 h-44">
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {song() ? (
          <div class="flex h-full flex-col items-center justify-center">
            <p class="text-3xl font-extrabold text-accent">{props.displayFn(song()!)}</p>
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
