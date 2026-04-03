import { For, type Component } from "solid-js";
import { Card, CardContent, CardHeader, CardTitle } from "../Card";
import type { StatsComponentProps } from "./types";

export const SongsByYear: Component<StatsComponentProps> = (props) => {
  const years = () => {
    const internalCounts: Record<string, number> = {};
    props
      .tracks()
      ?.slice(props.currentIndex())
      ?.forEach((track) => {
        const year = track.track.album.release_date.slice(0, 4) ?? undefined;
        internalCounts[year] = (internalCounts[year] || 0) + 1;
      });
    const sortedCounts = Object.entries(internalCounts).sort((a, b) => {
      // First sort by count (descending)
      const countDiff = b[1] - a[1];
      if (countDiff !== 0) return countDiff;

      // If counts are equal, sort by year (descending/newest first)
      return parseInt(b[0]) - parseInt(a[0]);
    });
    return sortedCounts;
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Songs By Year</CardTitle>
      </CardHeader>
      <CardContent class="h-36 overflow-y-auto">
        <For each={years()}>
          {([year, num]) => (
            <p>
              {year} - {num}
            </p>
          )}
        </For>
        {years().length === 0 && <p>No songs available</p>}
      </CardContent>
    </Card>
  );
};
