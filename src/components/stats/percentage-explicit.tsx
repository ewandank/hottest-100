import type { Component } from "solid-js";

import { Card, CardHeader, CardTitle, CardContent } from "../Card";
import type { StatsComponentProps } from "./types";

export const PercentageExplicit: Component<StatsComponentProps> = (props) => {
  const percentage = () => {
    const tracks = props.tracks();
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
    <Card class="col-span-2">
      <CardHeader>
        <CardTitle>Percentage Explicit</CardTitle>
      </CardHeader>
      <CardContent class="text-center text-3xl font-bold">
        {percentage() !== undefined ? (
          <>
            <p>{percentage()?.toFixed(2)}%</p>
          </>
        ) : (
          <p class="text-base font-normal">No songs available</p>
        )}
      </CardContent>
    </Card>
  );
};
