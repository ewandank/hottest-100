import { createQueries, createQuery } from "@tanstack/solid-query";
import { type ChartData } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { createMemo, type Component } from "solid-js";

import { spotifyAPIQueryOptions } from "~/query/spotify-api";
import { userDisplayNameQueryOptions } from "~/query/spotify-display-name";

import { Card, CardContent, CardHeader, CardTitle } from "../Card";
import { BarChart } from "../charts";
import type { StatsComponentProps } from "./types";

export const UserCountGraph: Component<StatsComponentProps> = (props) => {
  // Get all unique people in the playlist
  const allPeople = () => {
    const tracks = props.tracks ?? [];
    const ids = new Set<string>();
    for (const track of tracks) {
      if (track.added_by?.id) ids.add(track.added_by.id);
    }
    return Array.from(ids);
  };

  const maxYCount = createMemo(() => {
    const tracks = props.tracks ?? [];
    const counts: Record<string, number> = {};
    for (const track of tracks) {
      const id = track.added_by?.id;
      if (id) counts[id] = (counts[id] || 0) + 1;
    }

    if (Object.values(counts).length === 0) return 25;

    const maxValue = Math.max(...Object.values(counts));
    const withPadding = maxValue * 1.1;
    return Math.ceil(withPadding / 5) * 5;
  });

  const entries = createMemo<Record<string, number>>(() => {
    const currentIndex = props.currentIndex();
    const tracks = props.tracks?.slice(currentIndex) ?? [];

    return Object.fromEntries(
      allPeople().map((id) => {
        const count = tracks.filter((t) => t.added_by?.id === id).length;
        return [id, count];
      }),
    );
  });

  const spotifyQuery = createQuery(() => spotifyAPIQueryOptions);
  const displayNames = createQueries(() => ({
    queries: spotifyQuery.data
      ? Object.keys(entries()).map((id) => userDisplayNameQueryOptions(spotifyQuery.data, id))
      : [],
  }));
  const chartData = createMemo<ChartData>(() => {
    const values = Object.values(entries());
    return {
      labels: displayNames.map((d) => d.data ?? "Unknown"),
      datasets: [
        {
          data: values,
          //   bg-blue-500
          backgroundColor: ["oklch(62.3% 0.214 259.815)"],
          borderRadius: 20,
          borderSkipped: false,
        },
      ],
    };
  });

  return (
    <Card class="col-span-4">
      <CardHeader>
        <CardTitle>Who got the most songs in?</CardTitle>
      </CardHeader>
      <CardContent>
        <BarChart
          data={chartData()}
          options={{
            plugins: {
              legend: { display: false },
              tooltip: { enabled: false },
              datalabels: {
                anchor: "end",
                align: "top",
              },
            },
            scales: {
              y: { max: maxYCount() },
            },
          }}
          plugins={[ChartDataLabels]}
          width={600}
          height={200}
        />
      </CardContent>
    </Card>
  );
};
