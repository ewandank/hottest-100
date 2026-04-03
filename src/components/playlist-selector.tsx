import { createSignal, For, type Component } from "solid-js";
import { Link, getRouteApi } from "@tanstack/solid-router";

const route = getRouteApi("/player/");

export const PlaylistSelector: Component = () => {
  const playlists = route.useLoaderData();
  const [selectedId, setSelectedId] = createSignal("");

  return (
    <div class="flex flex-1 flex-col items-center justify-center">
      <div class="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4">
        <select
          id="playlist-select"
          value={selectedId()}
          onChange={(e) => setSelectedId(e.currentTarget.value)}
          class="w-full rounded-md bg-gray-400 px-4 py-3 text-lg text-white"
        >
          <option value="" disabled>
            Please select a playlist to shuffle...
          </option>
          <For each={playlists()?.items}>
            {(pl) => <option value={pl.id}>{pl.name}</option>}
          </For>
        </select>
        <Link
          to="/player/$playlistId"
          params={{ playlistId: selectedId() }}
          disabled={!selectedId()}
          class="w-full rounded-md px-4 py-3 text-center text-lg"
          classList={{
            "bg-gray-400 text-white": selectedId() !== "",
            "bg-gray-300 text-gray-100 cursor-not-allowed opacity-60":
              selectedId() === "",
          }}
        >
          Start the countdown
        </Link>
      </div>
    </div>
  );
};
