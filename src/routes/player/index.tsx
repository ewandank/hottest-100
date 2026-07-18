import { createFileRoute, Link } from "@tanstack/solid-router";
import { createSignal, For } from "solid-js";

import { getSpotifySdk } from "~/spotify-sdk";

export const Route = createFileRoute("/player/")({
  loader: async () => {
    const sdk = await getSpotifySdk(`${window.location.origin}/player`);
    if (!sdk) return { items: [] };
    return await sdk.currentUser.playlists.playlists();
  },
  component: PlaylistSelector,
});

function PlaylistSelector() {
  const playlists = Route.useLoaderData();
  const [selectedId, setSelectedId] = createSignal("");

  return (
    <div class="flex flex-1 flex-col items-center justify-center">
      <div class="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4">
        <select
          id="playlist-select"
          value={selectedId()}
          onChange={(e) => setSelectedId(e.currentTarget.value)}
          class="h-12 w-full rounded-lg bg-gray-400 px-4 py-3 text-lg text-white"
        >
          <option value="" disabled>
            Please select a playlist to shuffle...
          </option>
          <For each={playlists()?.items}>{(pl) => <option value={pl.id}>{pl.name}</option>}</For>
        </select>
        <Link
          to="/player/$playlistId"
          params={{ playlistId: selectedId() }}
          disabled={!selectedId()}
          class="flex h-12 w-full items-center justify-center rounded-lg bg-gray-400 px-4 py-3 text-center text-lg text-white"
          classList={{
            "bg-gray-400 text-white": selectedId() !== "",
            "bg-gray-300 text-gray-100 cursor-not-allowed opacity-60": selectedId() === "",
          }}
        >
          Start the countdown
        </Link>
      </div>
    </div>
  );
}
