import { For, type Accessor, type Component } from "solid-js";
import { useGlobalContext } from "../../context/context";
import { createDelayedSignal } from "../../signals/createDelayedSignal";
import { useUserDisplayNames, type ActualPlaylistedTrack } from "../../SpotifyHelper";
import type { ViewProps } from "../countdown-player";
import type { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { BarChart } from "../charts";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../Card";
import type { ChartData } from "chart.js";
import { millisToMinutesAndSeconds } from "../../utils";

export type StatsComponentProps = {
  spotify: Accessor<SpotifyApi | null>;
  tracks: Accessor<ActualPlaylistedTrack[] | undefined>;
  currentIndex: Accessor<number | undefined>;
};

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
    return props.tracks()?.length;
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
      <TopNArtists
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

      <BackToBack
        spotify={props.spotify}
        tracks={props.tracks}
        currentIndex={currentIndex}
      />
      <SongsByYear
        spotify={props.spotify}
        tracks={props.tracks}
        currentIndex={currentIndex}
      />
      <NewestSong
        spotify={props.spotify}
        tracks={props.tracks}
        currentIndex={currentIndex}
      />
      <OldestSong
        spotify={props.spotify}
        tracks={props.tracks}
        currentIndex={currentIndex}
      />
    </div>
  );
};



const UserCountGraph: Component<StatsComponentProps> = (props) => {
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


const LongestSong: Component<StatsComponentProps> = (props) => {
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

const ShortestSong: Component<StatsComponentProps> = (props) => {
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

const TopNArtists: Component<StatsComponentProps> = (props) => {
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
          Note that if more then one artist is on a song, they are counted
          separately.
        </p>
      </CardFooter>
    </Card>
  );
};

const BackToBack: Component<StatsComponentProps> = (props) => {
  const runs = () => {
    const currentTracks = props.tracks()?.slice(props.currentIndex());
    if (!currentTracks?.length) return [];

    const artistRuns: Array<{
      artist: string;
      positions: number[];
    }> = [];

    let currentRun: {
      artist: string;
      positions: number[];
    } | null = null;

    // Process tracks to find runs
    for (let i = 0; i < currentTracks.length - 1; i++) {
      const currentTrack = currentTracks[i];
      const nextTrack = currentTracks[i + 1];

      // Get original positions in the countdown (1-based)
      const currentPosition = i + props.currentIndex() + 1;
      const nextPosition = i + props.currentIndex() + 2;

      // Get artists from current and next tracks
      const currentArtists = currentTrack.track.artists;
      const nextArtists = nextTrack.track.artists;

      // Find shared artists between current and next tracks
      for (const currentArtist of currentArtists) {
        const isInRun = nextArtists.some(
          (nextArtist) => nextArtist.name === currentArtist.name,
        );

        if (isInRun) {
          // If we have an active run with this artist
          if (currentRun && currentRun.artist === currentArtist.name) {
            // Add next position to the run
            if (!currentRun.positions.includes(nextPosition)) {
              currentRun.positions.push(nextPosition);
            }
          } else {
            // Start a new run
            currentRun = {
              artist: currentArtist.name,
              positions: [currentPosition, nextPosition],
            };
            artistRuns.push(currentRun);
          }
        } else if (currentRun && currentRun.artist === currentArtist.name) {
          // End current run
          currentRun = null;
        }
      }
    }

    // Sort runs by length (longest runs first)
    return artistRuns.sort((a, b) => b.positions.length - a.positions.length);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>b2b2b</CardTitle>
      </CardHeader>
      <CardContent class="h-44 overflow-y-auto">
        <For each={runs()}>
          {(run) => (
            <div class="mb-2 text-lg">
              <p>
                <span class="font-bold">{run.artist}</span>
                {" - "}
                <span>
                  {run.positions.map((value) => `#${value}`).join(" & ")}
                </span>
              </p>
            </div>
          )}
        </For>
        {runs().length === 0 && <p>No artist has gone back to back</p>}
      </CardContent>
    </Card>
  );
};

const SongsByYear: Component<StatsComponentProps> = (props) => {
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
      <CardContent class="overflow-y-auto h-36">
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

const NewestSong: Component<StatsComponentProps> = (props) => {
  const newestSong = () => {
    const tracks = props.tracks();
    if (!tracks || tracks.length === 0) return undefined;

    const currentTracks = tracks.slice(props.currentIndex());
    if (!currentTracks || currentTracks.length === 0) return undefined;

    // Sort the tracks by release date in descending order (newest first)
    return [...currentTracks].sort((a, b) => {
      const dateA = a.track.album.release_date || "";
      const dateB = b.track.album.release_date || "";
      // Compare dates in string form since they're in YYYY-MM-DD format
      return dateB.localeCompare(dateA);
    })[0];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Newest Song</CardTitle>
      </CardHeader>
      <CardContent>
        {newestSong() !== undefined ? (
          <div class="flex flex-col items-center justify-center h-full">
            <p class="text-2xl font-extrabold">
              {formatDate(newestSong()!.track.album.release_date)}
            </p>
            <p class="font-bold">{newestSong()!.track.name}</p>
            <p>
              {newestSong()!
                .track.artists.map((artist) => artist.name)
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

const OldestSong: Component<StatsComponentProps> = (props) => {
  const oldestSong = () => {
    const tracks = props.tracks();
    if (!tracks || tracks.length === 0) return undefined;

    const currentTracks = tracks.slice(props.currentIndex());
    if (!currentTracks || currentTracks.length === 0) return undefined;

    // Sort the tracks by release date in ascending order (oldest first)
    return [...currentTracks].sort((a, b) => {
      const dateA = a.track.album.release_date || "";
      const dateB = b.track.album.release_date || "";
      // Compare dates in string form since they're in YYYY-MM-DD format
      return dateA.localeCompare(dateB);
    })[0];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Oldest Song</CardTitle>
      </CardHeader>
      <CardContent>
        {oldestSong() !== undefined ? (
          <div class="flex flex-col items-center justify-center h-full">
            <p class="text-2xl font-extrabold">
              {formatDate(oldestSong()!.track.album.release_date)}
            </p>
            <p class="font-bold">{oldestSong()!.track.name}</p>
            <p>
              {/* Use type assertion to handle the track types properly */}
              {(oldestSong()!.track.artists as { name: string }[])
                .map((artist) => artist.name)
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

// Helper function to convert YYYY-MM-DD date to DD/MM/YYYY format
const formatDate = (dateStr: string): string => {
  if (!dateStr) return "";

  // Check if the date is in the YYYY-MM-DD format
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [, year, month, day] = match;
    return `${day}/${month}/${year}`;
  }

  // If it's only YYYY format or any other format, return as is
  return dateStr;
};
