import { createFileRoute } from "@tanstack/solid-router";
import { PlaylistSelector } from "../components/playlist-selector";
import { getSpotifySdk } from "../spotify-sdk";

export const Route = createFileRoute("/player/")({
  loader: async () => {
    const sdk = await getSpotifySdk(`${window.location.origin}/player`);
    if (!sdk) return { items: [] };
    return await sdk.currentUser.playlists.playlists();
  },
  component: PlaylistSelector,
});
