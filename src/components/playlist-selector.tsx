import { createResource, createSignal, For, type Component } from "solid-js";
import { createSpotify } from "../signals/createSpotify";
import { useGlobalContext } from "../context/context";

export const PlaylistSelector: Component = () => {
  const spotify = createSpotify("http://localhost:5173/player");

  const [playlists] = createResource(spotify, async (sdk) => {
    if (!sdk) return null;
    return await sdk.currentUser.playlists.playlists();
  });

  const [store, setStore] = useGlobalContext();

  const [selectedId, setSelectedId] = createSignal("");

  return (
    <div>
      {playlists.loading && <span>Loading...</span>}
      {playlists.error && <span>Error: {playlists.error.message}</span>}
      {playlists() &&
        playlists()!.items &&
        Array.isArray(playlists()!.items) && (
          <div class="bg-jjj-gradient flex justify-center items-center min-h-screen">
            <div class="flex flex-col gap-4 w-full max-w-4xl mx-auto px-4">
              <select
                id="playlist-select"
                value={store.playlistId}
                onChange={(e) => setSelectedId(e.currentTarget.value)}
                class="w-full rounded-md bg-gray-400 text-white py-3 px-4 text-lg"
              >
                <option value="" disabled selected>
                  Please select a playlist to shuffle...
                </option>
                <For each={playlists()?.items}>
                  {(pl) => <option value={pl.id}>{pl.name}</option>}
                </For>
              </select>
              <button
                onClick={() => setStore("playlistId", selectedId())}
                disabled={!selectedId()}
                class="w-full rounded-md  py-3 px-4 text-lg"
                classList={{
                  "bg-gray-400 text-white": selectedId() !== undefined,
                  "bg-gray-300 text-gray-100 cursor-not-allowed opacity-60":
                    selectedId() === "",
                }}
              >
                Start the countdown
              </button>
            </div>
          </div>
        )}
    </div>
  );
};
