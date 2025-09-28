import { For, type Accessor, type Component } from "solid-js";
import { useGlobalContext } from "../../context/context";
import { createDelayedSignal } from "../../signals/createDelayedSignal";
import { useUserDisplayName, useUserDisplayNames } from "../../SpotifyHelper";
import type { ViewProps } from "../countdown-player";
import type { PlaylistedTrack, SpotifyApi } from "@spotify/web-api-ts-sdk";
import { BarChart } from "../charts";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../Card";
import type { ChartData } from "chart.js";
import { millisToMinutesAndSeconds } from "../../utils";

export const StatsView = (props: ViewProps) => {
  const [store] = useGlobalContext();
  const delayedIterator = createDelayedSignal(() => store.iterator, 30_000);
  const currentIndex = () => {
    if (props.showSpoilers()) {
      return 0;
    }
    if (delayedIterator() !== undefined) {
      return delayedIterator() - 1;
    }
    return props.tracks().length;
  };

  return (
    <div class="grid grid-cols-3 gap-5">
      {/* <UserCountTable
        spotify={props.spotify}
        tracks={props.tracks}
        currentIndex={currentIndex}
      />
      <ArtistCountTable
        spotify={props.spotify}
        tracks={props.tracks}
        currentIndex={currentIndex}
      /> */}
      <UserCountGraph
        spotify={props.spotify}
        tracks={props.tracks}
        currentIndex={currentIndex}
      />
      <LongestSong
        spotify={props.spotify}
        tracks={props.tracks}
        currentIndex={currentIndex}
      />
      <ShortestSong
        spotify={props.spotify}
        tracks={props.tracks}
        currentIndex={currentIndex}
      />
      <TopNArtists
        spotify={props.spotify}
        tracks={props.tracks}
        currentIndex={currentIndex}
      />
    </div>
  );
};

const UserCountTable: Component<{
  spotify: Accessor<SpotifyApi>;
  tracks: Accessor<PlaylistedTrack[]>;
  currentIndex: Accessor<number>;
}> = (props) => {
  const counts = () => {
    const internalCounts: Record<string, number> = {};
    props
      .tracks()
      ?.slice(props.currentIndex())
      ?.forEach((track) => {
        const name = track.added_by?.id ?? undefined;
        internalCounts[name] = (internalCounts[name] || 0) + 1;
      });
    const sortedCounts = Object.entries(internalCounts).sort(
      ([_key1, value1], [_key2, value2]) => value2 - value1,
    );
    return sortedCounts;
  };

  return (
    <div class="w-xl">
      <table class="min-w-[300px] w-full rounded">
        <thead>
          <tr>
            <th class="text-left px-4 py-2 border-b">Person</th>
            <th class="text-left px-4 py-2 border-b">Number of Songs</th>
          </tr>
        </thead>
        <tbody>
          <For each={counts()}>
            {([person, num]) => {
              const displayName = useUserDisplayName(props.spotify(), person);
              return (
                <tr>
                  <td class="px-4 py-2 border-b">
                    {displayName.data !== undefined
                      ? displayName.data
                      : "Unknown"}
                  </td>
                  <td class="px-4 py-2 border-b">{num}</td>
                </tr>
              );
            }}
          </For>
        </tbody>
      </table>
    </div>
  );
};

const UserCountGraph: Component<{
  spotify: Accessor<SpotifyApi>;
  tracks: Accessor<PlaylistedTrack[]>;
  currentIndex: Accessor<number>;
}> = (props) => {
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

    if (Object.values(counts).length === 0) return 10; // Default if no data

    const maxValue = Math.max(...Object.values(counts));
    // Add 10% padding to the top for visual appeal, then round to nearest multiple of 5
    const withPadding = maxValue * 1.1;
    return Math.ceil(withPadding / 5) * 5;
  };

  // Store the max value once - this won't change as the currentIndex changes
  const maxYValue = calculateMaxPossibleCount();

  // Compute counts for each person for the visible portion
  const getCounts = () => {
    const tracks = props.tracks()?.slice(props.currentIndex()) ?? [];
    const counts: Record<string, number> = {};
    for (const track of tracks) {
      const id = track.added_by?.id;
      if (id) counts[id] = (counts[id] || 0) + 1;
    }
    // Ensure all people are present, even if zero
    for (const id of allPeople()) {
      if (!(id in counts)) counts[id] = 0;
    }
    return allPeople().map((id) => [id, counts[id]] as [string, number]);
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
          data: [...values],
          //   bg-blue-500
          backgroundColor: ["oklch(62.3% 0.214 259.815)"],
          borderRadius: 20,
          borderSkipped: false,
        },
      ],
    };
  };

  return (
    <Card class="col-span-3">
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
            },
            scales: {
              y: { max: maxYValue },
            },
          }}
          width={600}
          height={200}
        />
      </CardContent>
    </Card>
  );
};

const ArtistCountTable: Component<{
  spotify: Accessor<SpotifyApi>;
  tracks: Accessor<PlaylistedTrack[]>;
  currentIndex: Accessor<number>;
}> = (props) => {
  const counts = () => {
    const internalCounts: Record<string, number> = {};
    props
      .tracks()
      ?.slice(props.currentIndex())
      ?.forEach((track) => {
        track.track.artists.forEach((artist) => {
          const name = artist.name ?? undefined;
          internalCounts[name] = (internalCounts[name] || 0) + 1;
        });
      });
    const sortedCounts = Object.entries(internalCounts).sort(
      ([_key1, value1], [_key2, value2]) => value2 - value1,
    );
    return sortedCounts;
  };

  return (
    <div class="max-h-[374px] overflow-y-auto rounded  w-xl">
      <table class="min-w-[300px] w-full">
        {/* TODO don't like the bg-white, but need a way for the scroll to not cover it */}
        <thead class="sticky top-0 z-10 bg-white">
          <tr>
            <th class="text-left px-4 py-2 border-b">Artist</th>
            <th class="text-left px-4 py-2 border-b">Number of Songs</th>
          </tr>
        </thead>
        <tbody>
          <For each={counts()}>
            {([person, num]) => (
              <tr>
                <td class="px-4 py-2 border-b">
                  {person !== undefined ? person : "Unknown"}
                </td>
                <td class="px-4 py-2 border-b">{num}</td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
};

const LongestSong: Component<{
  spotify: Accessor<SpotifyApi>;
  tracks: Accessor<PlaylistedTrack[]>;
  currentIndex: Accessor<number>;
}> = (props) => {
  const longestSong = () => {
    const tracks = props.tracks();
    if (!tracks || tracks.length === 0) return undefined;

    const currentTracks = tracks.slice(props.currentIndex());
    if (!currentTracks || currentTracks.length === 0) return undefined;

    // Sort the tracks by duration in descending order and take the first one
    return [...currentTracks].sort((a, b) => {
      // Safely handle potential undefined/null values
      const durationA = a?.track?.duration_ms || 0;
      const durationB = b?.track?.duration_ms || 0;
      return durationB - durationA; // Descending order (longest first)
    })[0];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Longest Song</CardTitle>
      </CardHeader>
      <CardContent class="text-center">
        {longestSong() !== undefined ? (
          <>
            <p class="text-6xl font-extrabold text-center">
              {millisToMinutesAndSeconds(longestSong()!.track.duration_ms)}
            </p>
            <p class="font-bold">{longestSong()!.track.name}</p>
            <p>
              {(longestSong()!.track.artists as { name: string }[])
                .map((artist) => artist.name)
                .join(",")}
            </p>
          </>
        ) : (
          <p>No songs available</p>
        )}
      </CardContent>
    </Card>
  );
};

const ShortestSong: Component<{
  spotify: Accessor<SpotifyApi>;
  tracks: Accessor<PlaylistedTrack[]>;
  currentIndex: Accessor<number>;
}> = (props) => {
  const shortestSong = () => {
    const tracks = props.tracks();
    if (!tracks || tracks.length === 0) return undefined;

    const currentTracks = tracks.slice(props.currentIndex());
    if (!currentTracks || currentTracks.length === 0) return undefined;

    // Sort the tracks by duration in ascending order and take the first one
    return currentTracks.sort((a, b) => {
      const durationA = a.track.duration_ms;
      const durationB = b.track.duration_ms;
      return durationA - durationB; // Ascending order (shortest first)
    })[0];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shortest Song</CardTitle>
      </CardHeader>
      <CardContent>
        {shortestSong() !== undefined ? (
          <div class="flex flex-col items-center justify-center h-full">
            <p class="text-6xl font-extrabold">
              {millisToMinutesAndSeconds(shortestSong()!.track.duration_ms)}
            </p>
            <p class="font-bold">{shortestSong()!.track.name}</p>
            <p>
              {/* Use type assertion to handle the track types properly */}
              {shortestSong()!
                .track.artists.map((a: { name: string }) => a.name)
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

const TopNArtists: Component<{
  spotify: Accessor<SpotifyApi>;
  tracks: Accessor<PlaylistedTrack[]>;
  currentIndex: Accessor<number>;
}> = (props) => {
  const TOP_N = 5; // Number of top entries to display

  const counts = () => {
    const internalCounts: Record<string, number> = {};
    props
      .tracks()
      ?.slice(props.currentIndex())
      ?.forEach((track) => {
        const artists = track.track.artists as { name: string }[];
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
      while (
        cutoffIndex < sortedCounts.length &&
        sortedCounts[cutoffIndex][1] === cutoffCount
      ) {
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
      <CardContent class="h-44 overflow-y-auto">
        <For each={counts()}>
          {([person, num], idx) => (
            <p class="py-0.5">
              <span class="font-bold">{idx() + 1}.</span> {person} - {num} song
              {num !== 1 ? "s" : ""}
            </p>
          )}
        </For>
      </CardContent>
      <CardFooter>
        <p class="text-xs opacity-80">
          Note that if more then one artist is on a song, they are counted
          separately.
        </p>
      </CardFooter>
    </Card>
  );
};

const BackToBack: Component<{
  spotify: Accessor<SpotifyApi>;
  tracks: Accessor<PlaylistedTrack[]>;
  currentIndex: Accessor<number>;
}> = (props) => {
  const runs = () => {}

  return (
    <Card>
      <CardHeader>
        <CardTitle>Artist Runs</CardTitle>
      </CardHeader>
      <CardContent class="h-44 overflow-y-auto">
        <For each={runs()}>
          {(run) => (
            <div class="mb-2">
              <p class="font-bold">{run.artist}</p>
              <p class="text-sm">
                Positions: {run.positions.join(", ")}
              </p>
            </div>
          )}
        </For>
        {runs().length === 0 && (
          <p class="text-sm opacity-80">No artist runs found yet.</p>
        )}
      </CardContent>
    </Card>
  );
};
