import type { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { Suspense, type Component } from "solid-js";
import { useUserDisplayName, type ActualPlaylistedTrack } from "../../SpotifyHelper";
export const TrackView: Component<{
  track: ActualPlaylistedTrack;
  idx: number;
  spotify: () => SpotifyApi | null;
}> = (props) => {
  const userName = useUserDisplayName(props.spotify(), props.track.added_by.id);
  return (
    <Suspense>
      <div class="flex w-full flex-row items-center py-4">
        <h2 class="w-16 shrink-0 text-3xl font-bold">{props.idx}</h2>

        <img class="size-36 shrink-0" src={props.track.track.album.images[1].url} />
        <div class="flex min-w-0 flex-col pl-4">
          <p class="font-bold wrap-break-word whitespace-normal"> {props.track.track.name}</p>
          <p class="wrap-break-word whitespace-normal">
            {props.track.track.artists.map((artist) => artist.name).join(",")}
          </p>
          <p class="wrap-break-word whitespace-normal text-gray-500">{userName.data}</p>
        </div>
      </div>
    </Suspense>
  );
};
