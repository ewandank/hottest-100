import type { Component } from "solid-js";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "~/components/Card";

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
    <Card class="col-span-2 flex flex-col">
      <CardHeader>
        <CardTitle>% of F**ks given</CardTitle>
      </CardHeader>
      <CardContent class="flex flex-1">
        {percentage() !== undefined ? (
          <div class="flex size-full items-center justify-center text-7xl font-extrabold">
            {percentage()?.toFixed(2)}%
          </div>
        ) : (
          "No songs available"
        )}
      </CardContent>
      <CardFooter class="text-xs opacity-80">
        Percentage of songs flagged by Spotify as <i>Explicit</i>.
      </CardFooter>
    </Card>
  );
};
