import { For, type Component } from "solid-js";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../Card";
import type { StatsComponentProps } from "./types";

export const TopNArtists: Component<StatsComponentProps> = (props) => {
  const TOP_N = 5; // Number of top entries to display

  const counts = () => {
    const internalCounts: Record<string, number> = {};
    props
      .tracks()
      ?.slice(props.currentIndex())
      ?.forEach((track) => {
        const artists = track.track.artists;
        artists.forEach((artist) => {
          const name = artist.name ?? undefined;
          internalCounts[name] = (internalCounts[name] || 0) + 1;
        });
      });
    const sortedCounts = Object.entries(internalCounts).sort(
      (a, b) => b[1] - a[1], // Sort by count value in descending order
    );

    // Include ties at the cutoff point
    if (sortedCounts.length > TOP_N) {
      const cutoffCount = sortedCounts[TOP_N - 1][1]; // Count value at position TOP_N

      // Find where to cut off (include all entries with the same count as the TOP_N position)
      let cutoffIndex = TOP_N;
      while (cutoffIndex < sortedCounts.length && sortedCounts[cutoffIndex][1] === cutoffCount) {
        cutoffIndex++;
      }

      return sortedCounts.slice(0, cutoffIndex);
    }

    return sortedCounts;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top {counts().length} Artists</CardTitle>
      </CardHeader>
      <CardContent class="h-56 overflow-y-auto">
        <For each={counts()}>
          {([person, num], idx) => {
            // Calculate the correct position (accounting for ties)
            let position = 1;
            for (let i = 0; i < idx(); i++) {
              // If current item's count is less than previous item's count, increment position
              if (counts()[i][1] > counts()[idx()][1]) {
                position++;
              }
            }
            return (
              <p class="py-0.5">
                <span class="font-bold">{position}.</span> {person} - {num} song
                {num !== 1 ? "s" : ""}
              </p>
            );
          }}
        </For>
      </CardContent>
      <CardFooter>
        <p class="text-xs opacity-80">
          Note that if more then one artist is on a song, they are counted separately.
        </p>
      </CardFooter>
    </Card>
  );
};
