import { createResource, createSignal, For, type Component } from "solid-js";
import { Link } from "@tanstack/solid-router";
import { createSpotify } from "../signals/createSpotify";
import { useGlobalContext } from "../context/context";

export const PlaylistSelector: Component = () => {
  const spotify = createSpotify(`${window.location.origin}/player`);

  const [playlists] = createResource(spotify, async (sdk) => {
    if (!sdk) return null;
    return await sdk.currentUser.playlists.playlists();
  });

  const [store] = useGlobalContext();

  const [selectedId, setSelectedId] = createSignal("");

  return (
    <div>
      {playlists.loading && <span>Loading...</span>}
      {playlists.error && <span>Error: {playlists.error.message}</span>}
      {playlists() &&
        playlists()!.items &&
        Array.isArray(playlists()!.items) && (
          <div class="bg-jjj-gradient flex min-h-screen items-center justify-center">
            <div class="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4">
              <select
                id="playlist-select"
                value={store.playlistId || ""}
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
        )}
    </div>
  );
};
