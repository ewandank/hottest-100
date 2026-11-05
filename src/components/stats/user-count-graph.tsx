import { barY, defineChart, text } from "@tanstack/charts";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { Chart } from "@tanstack/charts/solid";
import { createQueries, createQuery } from "@tanstack/solid-query";
import { createMemo, Show, type Component } from "solid-js";

import { spotifyAPIQueryOptions } from "~/query/spotify-api";
import { userDisplayNameQueryOptions } from "~/query/spotify-display-name";

import { Card, CardContent, CardHeader, CardTitle } from "../Card";
import type { StatsComponentProps } from "./types";

export const UserCountGraph: Component<StatsComponentProps> = (props) => {
  return (
    <Card class="col-span-4">
      <CardHeader>
        <CardTitle>Who got the most songs in?</CardTitle>
      </CardHeader>
      <CardContent>
        <CountBarChart tracks={props.tracks} currentIndex={props.currentIndex} />
      </CardContent>
    </Card>
  );
};

const CountBarChart: Component<StatsComponentProps> = (props) => {
  const allPeople = createMemo(() => {
    const tracks = props.tracks ?? [];
    const ids = new Set<string>();

    for (const track of tracks) {
      for (const contributor of track.added_by) {
        if (contributor.id) ids.add(contributor.id);
      }
    }

    return Array.from(ids);
  });

  const counts = createMemo(() => {
    const currentIndex = props.currentIndex() ?? 0;
    const tracks = props.tracks?.slice(currentIndex) ?? [];
    const countByPerson = new Map<string, number>();

    for (const track of tracks) {
      for (const contributor of track.added_by) {
        const id = contributor.id;
        if (!id) continue;
        countByPerson.set(id, (countByPerson.get(id) ?? 0) + 1);
      }
    }

    return allPeople()
      .map((id) => ({ id, count: countByPerson.get(id) ?? 0 }))
      .toSorted((a, b) => b.count - a.count);
  });

  const maxYCount = createMemo(() => {
    const tracks = props.tracks ?? [];
    const countByPerson = new Map<string, number>();

    for (const track of tracks) {
      for (const contributor of track.added_by) {
        const id = contributor.id;
        if (!id) continue;
        countByPerson.set(id, (countByPerson.get(id) ?? 0) + 1);
      }
    }

    const maxValue = Math.max(...countByPerson.values(), 0);

    if (maxValue === 0) return 25;
    return maxValue;
  });

  const spotifyQuery = createQuery(() => spotifyAPIQueryOptions);
  const displayNames = createQueries(() => ({
    queries: counts().map(({ id }) => userDisplayNameQueryOptions(spotifyQuery.data, id)),
  }));

  const chartRows = createMemo(() => {
    if (
      !props.tracks ||
      allPeople().length === 0 ||
      !displayNames.every((query) => query.isSuccess)
    ) {
      return [];
    }

    return counts().map(({ count }, index) => ({
      person: displayNames[index]?.data ?? "Unknown",
      count,
      labelPosition: count / 2,
    }));
  });

  const chartDefinition = createMemo(() => {
    const rows = chartRows();
    const labelRows = rows.filter(({ count }) => count > 0);

    return defineChart({
      svgAnimation: true,
      marks: [
        barY(rows, {
          x: "person",
          y: "count",
          inset: 2,
          radius: 8,
          fill: "var(--accent)",
        }),
        text(labelRows, {
          x: "person",
          y: "labelPosition",
          text: "count",
          dy: 0,
          anchor: "middle",
          fontSize: 12,
          fontWeight: 600,
          fill: "white",
        }),
      ],
      scales: {
        y: {
          scale: scaleLinear().domain([0, maxYCount()]),
          grid: true,
        },
        x: {
          scale: () =>
            scaleBand()
              .domain(rows.map((row) => row.person))
              .padding(0.2),

          axis: {
            tickLabels: {
              rotate: -50,
              thin: false,
            },
          },
        },
      },
      pointer: false,

      keyboard: false,
    });
  });

  return (
    <div class="h-90">
      <Show when={displayNames.every((q) => q.isSuccess) && props.tracks !== undefined}>
        <Chart
          definition={chartDefinition()}
          ariaLabel="Who got the most songs in?"
          ariaDescription="Vertical bar chart showing how many tracks each contributor added."
          height={360}
        />
      </Show>
    </div>
  );
};
