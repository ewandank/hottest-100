import { For, type Accessor, type Component } from "solid-js";
import { useGlobalContext } from "../../context/context";
import { createDelayedSignal } from "../../signals/createDelayedSignal";
import { useUserDisplayName } from "../../SpotifyHelper";
import type { ViewProps } from "../countdown-player";
import type { PlaylistedTrack, SpotifyApi } from "@spotify/web-api-ts-sdk";

export const StatsView = (props: ViewProps) => {
  const [store] = useGlobalContext();
  const delayedIterator = createDelayedSignal(() => store.iterator, 30_000);
  const currentIndex = () => {
    if (props.showSpoilers()) {
      return 0;
    }
    if (delayedIterator() !== undefined) {
      return delayedIterator();
    }
    return props.tracks().length;
  };

  return (
    <div class="flex flex-row gap-8">
      <UserCountTable
        spotify={props.spotify}
        tracks={props.tracks}
        currentIndex={currentIndex}
      />
      <ArtistCountTable
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
  currentIndex: Accesor<number>;
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

const ArtistCountTable: Component<{
  spotify: Accessor<SpotifyApi>;
  tracks: Accessor<PlaylistedTrack[]>;
  currentIndex: Accesor<number>;
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
