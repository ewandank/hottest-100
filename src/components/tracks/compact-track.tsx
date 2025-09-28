import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { Suspense, type Component } from "solid-js";
import {
  useUserDisplayName,
  type ActualPlaylistedTrack,
} from "../../SpotifyHelper";

export const CompactTrackView: Component<{
  track: ActualPlaylistedTrack;
  idx: number;
  spotify: () => SpotifyApi | null;
}> = (props) => {
  const userName = useUserDisplayName(props.spotify(), props.track.added_by.id);
  return (
    <Suspense>
      <div class="flex flex-row w-full items-center py-4">
        <h2 class="font-bold text-3xl w-24">{props.idx}</h2>

        <div class="pl-4 flex flex-col">
          <p class="font-bold"> {props.track.track.name}</p>
          <p>
            {props.track.track.artists.map((artist) => artist.name).join(",")}
          </p>
          <p class="text-gray-500">{userName.data}</p>
        </div>
      </div>
    </Suspense>
  );
};
