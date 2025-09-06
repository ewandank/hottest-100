import { createResource, createSignal, type Component } from "solid-js";
import { createSpotify } from "../resources/createSpotify";

export const PlaylistSelector: Component<{
  setPlaylistId: (p: string) => void;
}> = (props) => {
  const spotify = createSpotify("http://localhost:5173/");

  const [playlists] = createResource(spotify, async (sdk) => {
    if (!sdk) return null;
    return await sdk.currentUser.playlists.playlists();
  });

  const [selectedId, setSelectedId] = createSignal("");

  return (
    <div>
      {playlists.loading && <span>Loading...</span>}
      {playlists.error && <span>Error: {playlists.error.message}</span>}
      {playlists() && playlists().items && Array.isArray(playlists().items) && (
        <>
          <label for="playlist-select">Pick a playlist:</label>
          <select
            id="playlist-select"
            value={selectedId()}
            onChange={(e) => setSelectedId(e.currentTarget.value)}
          >
            {playlists().items?.map((pl) => (
              <option value={pl.id}>{pl.name}</option>
            ))}
          </select>
          {selectedId() &&
            playlists() &&
            playlists().items &&
            Array.isArray(playlists().items) && (
              <div style={{ "margin-top": "1rem" }}>
                {/* TODO, this should be able to start the countdown but i get some weird autoplay thing? might need an aria role */}
                <button onClick={() => props.setPlaylistId(selectedId())}>
                  Go to player or something
                </button>
              </div>
            )}
        </>
      )}
    </div>
  );
};
