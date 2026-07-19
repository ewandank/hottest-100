import type { Component } from "solid-js";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../Card";
import type { StatsComponentProps } from "./types";

export const PercentageExplicit: Component<StatsComponentProps> = (props) => {
  const percentage = () => {
    const tracks = props.tracks;
    if (!tracks || tracks.length === 0) {
      return undefined;
    }
    const currentTracks = tracks.slice(props.currentIndex());
    if (!currentTracks || currentTracks.length === 0) {
      return undefined;
    }

    let numExplicit = 0;
    for (const track of currentTracks) {
      numExplicit += +track.track.explicit;
    }
    return (numExplicit / currentTracks.length) * 100;
  };

  return (
    <Card class="col-span-2 flex flex-col justify-between">
      <CardHeader>
        <CardTitle>% of F**ks given</CardTitle>
      </CardHeader>
      <CardContent class="flex h-20 flex-col items-center justify-center p-0">
        {percentage() !== undefined ? (
          <p class="text-6xl font-extrabold">{percentage()?.toFixed(2)}%</p>
        ) : (
          <p class="text-base font-normal">No songs available</p>
        )}
      </CardContent>
      <CardFooter>
        <p class="text-xs opacity-80">
          Percentage of songs flagged by Spotify as <i>Explicit</i>.
        </p>
      </CardFooter>
    </Card>
  );
};
