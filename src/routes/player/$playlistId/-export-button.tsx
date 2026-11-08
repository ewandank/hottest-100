import { createMutation } from "@tanstack/solid-query";
import LoaderCircleIcon from "lucide-solid/icons/loader-circle";
import ShareIcon from "lucide-solid/icons/share";
import { type Component, Show } from "solid-js";
import { toast } from "solid-sonner";

import type { ActualPlaylistedTrack } from "~/types/spotify";
import { getFormattedDate } from "~/utils";

import { createSpotifyApi } from "../-create-spotify";

export const ExportButton: Component<{
  tracks: ActualPlaylistedTrack[] | undefined;
}> = (props) => {
  const playlistTitle = `${getFormattedDate()} Hottest 100 Results`;
  const spotify = createSpotifyApi();
  const createPlaylistMutation = createMutation(() => ({
    mutationFn: async () => {
      const tracks = props.tracks;
      if (!tracks || tracks.length === 0) throw new Error("No tracks available to export.");

      const userId = (await spotify.currentUser.profile()).id;
      if (!userId) throw new Error("Unable to determine current user ID.");

      const createdPlaylist = await spotify.playlists.createPlaylist(userId, {
        name: playlistTitle,
      });
      await spotify.playlists.updatePlaylistItems(createdPlaylist.id, {
        uris: tracks.map(({ track }) => track.uri),
      });
    },
    onSuccess: () => toast.success(`Created Playlist: ${playlistTitle}`),
    onError: (e) =>
      toast.error("Failed to create playlist", {
        description: e instanceof Error ? e.message : String(e),
      }),
  }));
  return (
    <button
      aria-label="Export as Playlist"
      onClick={() => createPlaylistMutation.mutate()}
      disabled={createPlaylistMutation.isPending}
    >
      <Show when={!createPlaylistMutation.isPending}>
        <ShareIcon />
      </Show>
      <Show when={createPlaylistMutation.isPending}>
        <LoaderCircleIcon class="animate-spin opacity-50" />
      </Show>
    </button>
  );
};
