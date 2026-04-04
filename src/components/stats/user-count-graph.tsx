import { type Component } from "solid-js";
import { type ChartData } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { BarChart } from "../charts";
import { Card, CardContent, CardHeader, CardTitle } from "../Card";
import { useUserDisplayNames } from "../../SpotifyHelper";
import type { StatsComponentProps } from "./types";

export const UserCountGraph: Component<StatsComponentProps> = (props) => {
  // Get all unique people in the playlist
  const allPeople = () => {
    const tracks = props.tracks() ?? [];
    const ids = new Set<string>();
    for (const track of tracks) {
      if (track.added_by?.id) ids.add(track.added_by.id);
    }
    return Array.from(ids);
  };

  // Calculate the maximum possible count for any user (based on full dataset)
  const calculateMaxPossibleCount = () => {
    const tracks = props.tracks() ?? [];
    const counts: Record<string, number> = {};
    for (const track of tracks) {
      const id = track.added_by?.id;
      if (id) counts[id] = (counts[id] || 0) + 1;
    }

    if (Object.values(counts).length === 0) return 25; // Default if no data

    const maxValue = Math.max(...Object.values(counts));
    // Add 10% padding to the top for visual appeal, then round to nearest multiple of 5
    const withPadding = maxValue * 1.1;
    return Math.ceil(withPadding / 5) * 5;
  };

  // Store the max value once - this won't change as the currentIndex changes
  const maxYValue = calculateMaxPossibleCount();

  // Compute counts for each person for the visible portion
  const getCounts = (): [string, number][] => {
    const tracks = props.tracks()?.slice(props.currentIndex()) ?? [];

    return allPeople().map((id) => {
      const count = tracks.filter((t) => t.added_by?.id === id).length;
      return [id, count];
    });
  };

  const chartData = (): ChartData => {
    const entries = getCounts();
    const ids = entries.map(([id]) => id);
    const values = entries.map(([, value]) => value);
    const displayNames = useUserDisplayNames(props.spotify(), ids);
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
  };

  return (
    <Card class="col-span-2">
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
              y: { max: maxYValue },
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
