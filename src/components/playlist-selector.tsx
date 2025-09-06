import { createResource, createSignal, type Component } from "solid-js";
import { createSpotify } from "../resources/createSpotify";

export const PlaylistSelector: Component<{
  setPlaylistId: (p: string) => void;
}> = (props) => {
  const spotify = createSpotify(
    import.meta.env.VITE_CLIENT_ID,
    "http://localhost:5173/",
    [
      "playlist-read-private",
      "user-modify-playback-state",
      "streaming",
      "user-read-email",
      "user-read-private",
    ],
  );

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
                  <button onClick={() => props.setPlaylistId(selectedId())}>Start the countdown?</button>
              </div>
            )}
        </>
      )}
    </div>
  );
};
