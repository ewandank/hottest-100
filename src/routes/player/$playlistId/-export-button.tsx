import type { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { createMutation } from "@tanstack/solid-query";
import LoaderCircleIcon from "lucide-solid/icons/loader-circle";
import ShareIcon from "lucide-solid/icons/share";
import { type Component, type Accessor, Show } from "solid-js";
import { toast } from "solid-sonner";

import type { ActualPlaylistedTrack } from "~/types/spotify";
import { getFormattedDate } from "~/utils";

export const ExportButton: Component<{
  tracks: Accessor<ActualPlaylistedTrack[] | undefined>;
  spotify: () => SpotifyApi | null;
}> = (props) => {
  const playlistTitle = `${getFormattedDate()} Hottest 100 Results`;
  const createPlaylistMutation = createMutation(() => ({
    mutationFn: async () => {
      const userId = (await props.spotify()?.currentUser.profile())?.id;
      if (!userId) {
        throw new Error("no user to make playlist?");
      }
      const createdPlaylist = await props
        .spotify()
        ?.playlists.createPlaylist(userId, { name: playlistTitle });
      if (!createdPlaylist) {
        throw new Error("Failed to make playlist");
      }
      return props.spotify()?.playlists.updatePlaylistItems(createdPlaylist.id, {
        uris: props.tracks()!.map(({ track }) => track.uri),
      });
    },
    onSuccess: () => toast.success(`Created Playlist: ${playlistTitle}`),
    onError: (e) => toast.error("Failed to create playlist", { description: e.message }),
  }));
  return (
    <button
      aria-label="Export as Playlist"
      onClick={() => createPlaylistMutation.mutate()}
      disabled={createPlaylistMutation.isError || createPlaylistMutation.isPending}
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
