import { createFileRoute } from "@tanstack/solid-router";
import { Link } from "@tanstack/solid-router";
import { createResource, createSignal } from "solid-js";
import { createSpotify } from "../resources/createSpotify";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

function IndexComponent() {
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
              <option value={pl.id}>
                {pl.name}
              </option>
            ))}
          </select>
          {selectedId() && playlists() && playlists().items && Array.isArray(playlists().items) && (
            <div style={{ 'margin-top': "1rem" }}>
              <strong>Selected Playlist:</strong>
              <div>
                {playlists().items?.find((pl) => pl.id === selectedId())?.name}
              </div>
              <Link
                to="/player"
                search={{ playlistId: selectedId() }}
                style={{
                  display: "inline-block",
                  'margin-top': "1rem",
                  padding: "0.5rem 1rem",
                  background: "#1db954",
                  color: "white",
                  'border-radius': "4px",
                  'text-decoration': "none",
                  'font-weight': "bold",
                  'font-size': "1rem",
                  cursor: "pointer",
                }}
              >
                Let's Go
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
