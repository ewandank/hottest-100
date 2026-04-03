import { For, type Component } from "solid-js";
import { Card, CardContent, CardHeader, CardTitle } from "../Card";
import type { StatsComponentProps } from "./types";

export const BackToBack: Component<StatsComponentProps> = (props) => {
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
      const currentIndex = props.currentIndex() ?? 0;
      const currentPosition = i + currentIndex + 1;
      const nextPosition = i + currentIndex + 2;

      // Get artists from current and next tracks
      const currentArtists = currentTrack.track.artists;
      const nextArtists = nextTrack.track.artists;

      // Find shared artists between current and next tracks
      for (const currentArtist of currentArtists) {
        const isInRun = nextArtists.some((nextArtist) => nextArtist.name === currentArtist.name);

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
                <span>{run.positions.map((value) => `#${value}`).join(" & ")}</span>
              </p>
            </div>
          )}
        </For>
        {runs().length === 0 && <p>No artist has gone back to back</p>}
      </CardContent>
    </Card>
  );
};
