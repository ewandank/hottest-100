import type { PlaylistedTrack, SpotifyApi } from "@spotify/web-api-ts-sdk";
import { createResource, Suspense, type Component } from "solid-js";
import { userCache } from "../../SpotifyHelper";
export const CompactTrackView: Component<{
  track: PlaylistedTrack;
  idx: number;
  spotify: () => SpotifyApi;
}> = (props) => {
  const [userName] = createResource(props.spotify, async (sdk) => {
    if (!sdk) return undefined;
    const userId = props.track.added_by.id;
    if (userCache.has(userId)) {
      return userCache.get(userId);
    }
    const user = await sdk.users.profile(userId);
    const name = user?.display_name ?? userId;
    userCache.set(userId, name);
    return name;
  });
  return (
    <Suspense>
      <div class="flex flex-row w-full items-center py-4">
        <h2 class="font-bold text-3xl w-24">{props.idx}</h2>

        <div class="pl-4 flex flex-col">
          <p class="font-bold"> {props.track.track.name}</p>
          <p>
            {(props.track.track.artists as { name: string }[])
              .map((artist) => artist.name)
              .join(",")}
          </p>
          <p class="text-gray-500">{userName()}</p>
        </div>
      </div>
    </Suspense>
  );
};
