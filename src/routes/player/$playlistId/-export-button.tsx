import { createMutation, createQuery } from "@tanstack/solid-query";
import LoaderCircleIcon from "lucide-solid/icons/loader-circle";
import ShareIcon from "lucide-solid/icons/share";
import { type Component, Show } from "solid-js";
import { toast } from "solid-sonner";

import { spotifyAPIQueryOptions } from "~/query/spotify-api";
import type { ActualPlaylistedTrack } from "~/types/spotify";
import { getFormattedDate } from "~/utils";

export const ExportButton: Component<{
  tracks: ActualPlaylistedTrack[] | undefined;
}> = (props) => {
  const playlistTitle = `${getFormattedDate()} Hottest 100 Results`;
  const spotifyQuery = createQuery(() => spotifyAPIQueryOptions);
  const createPlaylistMutation = createMutation(() => ({
    mutationFn: async () => {
      const tracks = props.tracks;
      if (!spotifyQuery.data) throw new Error("Spotify client is not available.");
      if (!tracks || tracks.length === 0) throw new Error("No tracks available to export.");

      const userId = (await spotifyQuery.data.currentUser.profile()).id;
      if (!userId) throw new Error("Unable to determine current user ID.");

      const createdPlaylist = await spotifyQuery.data.playlists.createPlaylist(userId, {
        name: playlistTitle,
      });
      await spotifyQuery.data.playlists.updatePlaylistItems(createdPlaylist.id, {
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
