import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { Suspense, type Component } from "solid-js";
import { useUserDisplayName, type ActualPlaylistedTrack } from "../../SpotifyHelper";

export const CompactTrackView: Component<{
  track: ActualPlaylistedTrack;
  idx: number;
  spotify: () => SpotifyApi | null;
}> = (props) => {
  const userName = useUserDisplayName(props.spotify(), props.track.added_by.id);
  return (
    <Suspense>
      <div class="flex w-full flex-row items-center py-4">
        <h2 class="w-24 text-3xl font-bold">{props.idx}</h2>

        <div class="flex flex-col pl-4">
          <p class="font-bold"> {props.track.track.name}</p>
          <p>{props.track.track.artists.map((artist) => artist.name).join(",")}</p>
          <p class="text-gray-500">{userName.data}</p>
        </div>
      </div>
    </Suspense>
  );
};
