import { For, type Component, createMemo } from "solid-js";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../Card";
import type { StatsComponentProps } from "./types";

export const TopNArtists: Component<StatsComponentProps> = (props) => {
  const TOP_N = 5; // Number of top entries to display

  const sortedCounts = createMemo(() => {
    // TODO deslopify
    const tracks = props.tracks()?.slice(props.currentIndex()) ?? [];

    const counts: Record<string, number> = {};
    tracks
      .flatMap((t) => t.track.artists)
      .forEach(({ name }) => {
        if (name) counts[name] = (counts[name] ?? 0) + 1;
      });

    // 2. Convert to entries and sort descending
    const sorted = Object.entries(counts).toSorted(([, a], [, b]) => b - a);

    // 3. Handle TOP_N cutoff with ties
    if (sorted.length <= TOP_N) return sorted;

    const cutoffEntry = sorted[TOP_N - 1];
    if (!cutoffEntry) return sorted;

    const cutoffValue = cutoffEntry[1];
    // Find the last index that matches the cutoff value to include all ties
    const lastIndexWithTies = sorted.findLastIndex(
      ([, count]) => count === cutoffValue,
    );

    return sorted.slice(0, Math.max(TOP_N, lastIndexWithTies + 1));
  });

  const displayData = createMemo(() => {
    const data = sortedCounts();
    return data.map(([person, num], idx) => {
      // Calculate the correct position (accounting for ties)
      let position = 1;
      for (let i = 0; i < idx; i++) {
        const prevItem = data[i];
        // If current item's count is less than previous item's count, increment position
        if (prevItem && prevItem[1] > num) {
          position++;
        }
      }
      return { person, num, position };
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top {displayData().length} Artists</CardTitle>
      </CardHeader>
      <CardContent class="h-56 overflow-y-auto">
        <For each={displayData()}>
          {(artist) => (
            <p class="py-0.5">
              <span class="font-bold">{artist.position}.</span> {artist.person}{" "}
              - {artist.num} song
              {artist.num !== 1 ? "s" : ""}
            </p>
          )}
        </For>
      </CardContent>
      <CardFooter>
        <p class="text-xs opacity-80">
          Note that if more than one artist is on a song, they are counted
          separately.
        </p>
      </CardFooter>
    </Card>
  );
};
