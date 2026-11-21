import { createFileRoute, Link } from "@tanstack/solid-router";
import AlertTriangleIcon from "lucide-solid/icons/triangle-exclamation-point";
import { createSignal, For } from "solid-js";

export const Route = createFileRoute("/player/")({
  loader: async ({ context }) => {
    const sdk = context.sdk;
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
        <div class="flex gap-2 rounded-lg bg-amber-200 p-3 text-amber-700">
          {/* I can't really make this actually check since you need to be playing to see the queue. */}
          <AlertTriangleIcon /> Please check that your queue is empty on another device before
          starting.
        </div>
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
          // classList doesn't work here for some reason...
          class={`flex h-12 w-full items-center justify-center rounded-lg px-4 py-3 text-center text-lg text-white ${selectedId() ? "bg-gray-400" : "cursor-disabled bg-gray-200"}`}
        >
          Start the countdown
        </Link>
      </div>
    </div>
  );
}
