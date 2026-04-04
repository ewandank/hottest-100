import { For, type Component } from "solid-js";
import { Card, CardContent, CardHeader, CardTitle } from "../Card";
import type { StatsComponentProps } from "./types";

export const BackToBack: Component<StatsComponentProps> = (props) => {
  const runs = () => {
    const allTracks = props.tracks() || [];
    const startIndex = props.currentIndex() || 0;
    const currentTracks = allTracks.slice(startIndex);

    if (currentTracks.length < 2) return [];

    const artistRuns: Array<{ artist: string; positions: number[] }> = [];
    let activeRun: { artist: string; positions: number[] } | null = null;

    for (let i = 0; i < currentTracks.length - 1; i++) {
      const currentArtistNames = currentTracks[i]?.track.artists.map(
        (a) => a.name,
      );
      const nextArtistNames = currentTracks[i + 1]?.track.artists.map(
        (a) => a.name,
      );

      // Find if the current artist in the active run continues to the next track
      // Or find a new shared artist to start a run
      const sharedArtist: string | undefined = activeRun
        ? nextArtistNames?.find((name) => name === activeRun?.artist)
        : currentArtistNames?.find((name) => nextArtistNames?.includes(name));

      if (sharedArtist) {
        const nextPos = startIndex + i + 2;

        if (activeRun && activeRun.artist === sharedArtist) {
          activeRun.positions.push(nextPos);
        } else {
          activeRun = {
            artist: sharedArtist,
            positions: [startIndex + i + 1, nextPos],
          };
          artistRuns.push(activeRun);
        }
      } else {
        activeRun = null;
      }
    }

    return artistRuns.toSorted(
      (a, b) => b.positions.length - a.positions.length,
    );
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
