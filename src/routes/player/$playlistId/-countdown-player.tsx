import type { PlaylistedTrack } from "@spotify/web-api-ts-sdk";
import { createQuery, skipToken } from "@tanstack/solid-query";
import { getRouteApi } from "@tanstack/solid-router";
import EyeIcon from "lucide-solid/icons/eye";
import EyeOffIcon from "lucide-solid/icons/eye-off";
import GalleryVertical from "lucide-solid/icons/gallery-vertical";
import List from "lucide-solid/icons/list";
import Pause from "lucide-solid/icons/pause";
import Play from "lucide-solid/icons/play";
import Trash2Icon from "lucide-solid/icons/trash-2";
import {
  createEffect,
  createSignal,
  type Component,
  Show,
  type Accessor,
  onCleanup,
  Suspense,
} from "solid-js";

import { useGlobalContext } from "~/context/context";
import { hottestNumberQueryOptions } from "~/query/hottest-number";
import { spotifyAPIQueryOptions } from "~/query/spotify-api";
import { queryClient } from "~/queryClient";
import type { ActualPlaylistedTrack } from "~/types/spotify";
import { debounce, shuffle, playNumber } from "~/utils";

import { ExportButton } from "./-export-button";
import { StatsView } from "./-stats-grid";
import { CompactListView } from "./-views/CompactListView";
import { ListView } from "./-views/ListView";

const route = getRouteApi("/player/$playlistId");

const [view, setView] = createSignal<"list" | "compact-list">("list");
const [player, setPlayer] = createSignal<Spotify.Player | null>(null);

export const CountdownPlayer: Component = () => {
  const params = route.useParams();
  // I'm losing reactivity here but its probably ok as it should be static.
  const playlistId = params().playlistId;
  const [store, setStore] = useGlobalContext();
  const [disabled, setDisabled] = createSignal(false);
  const spotifyQuery = createQuery(() => spotifyAPIQueryOptions);
  createEffect(() => {
    // Wait for authorization before injecting the SDK script
    void spotifyQuery.data?.getAccessToken().then((token) => {
      if (token && !document.getElementById("spotify-sdk")) {
        const script = document.createElement("script");
        script.id = "spotify-sdk";
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);
      }
    });
  });

  onCleanup(() => {
    player()?.disconnect();
    // This helps when this component gets hmr-ed.
    const script = document.getElementById("spotify-sdk");
    script?.remove();
  });
  createEffect(() => {
    void (async () => {
      if (spotifyQuery.data === null) {
        return;
      }

      window.onSpotifyWebPlaybackSDKReady = () => {
        const internalPlayer = new window.Spotify.Player({
          name: "Hottest 100 Player",
          getOAuthToken: (cb) => {
            void spotifyQuery.data
              ?.getAccessToken()
              // Cheeky non-null assert
              .then((token) => cb(token!.access_token));
          },
          // just go full volume, use your systems volume if you want that.
          volume: 1,
        });
        void internalPlayer.connect();
        setPlayer(internalPlayer);
        internalPlayer.addListener("ready", async ({ device_id }) => {
          await spotifyQuery.data?.player.transferPlayback([device_id]);
          try {
            await spotifyQuery.data?.player.setRepeatMode("off", device_id);
          } catch (e) {
            if (e instanceof SyntaxError) {
              // This throws a syntax error as the api incorrectly assumes it returns JSON, however it just returns a string.
              return;
            }
            throw e;
          }
        });
        internalPlayer.addListener("player_state_changed", debouncedHandlePlayerStateChange);
        internalPlayer.addListener("player_state_changed", handlePauseState);
      };
    })();
  });
  const [paused, setPaused] = createSignal(true);
  const handlePauseState = (state: Spotify.PlaybackState) => setPaused(state?.paused ?? false);
  const handlePlayerStateChange = async (state: Spotify.PlaybackState) => {
    if (state?.track_window) {
      if (
        state.track_window.previous_tracks.find(
          (x) => x.uid === state.track_window.current_track.uid,
        ) &&
        state.paused
      ) {
        await countdownHandler();
      }
    }
  };

  const debouncedHandlePlayerStateChange = debounce(handlePlayerStateChange, 20);

  const tracksQuery = createQuery(() => ({
    queryKey: ["shuffledTracks", playlistId],
    queryFn: spotifyQuery.data
      ? async () => {
          const fields =
            "items(added_by(id),track(name,album(images,release_date),artists(name),uri,duration_ms,explicit)),total";
          // First call just to discover total number of tracks
          const firstPage = await spotifyQuery.data.playlists.getPlaylistItems(
            playlistId,
            undefined,
            fields,
            undefined, // defaults to 100.
            0,
          );

          const total = firstPage.total ?? firstPage.items.length;
          const allItems: PlaylistedTrack[] = [...firstPage.items];

          if (total > firstPage.items.length) {
            // Calculate offsets for remaining pages
            const offsets: number[] = [];
            for (let offset = firstPage.items.length; offset < total; offset += 100) {
              offsets.push(offset);
            }

            // Kick off all requests in parallel
            const pages = await Promise.all(
              offsets.map((offset) =>
                spotifyQuery.data.playlists.getPlaylistItems(
                  playlistId,
                  undefined,
                  fields,
                  undefined, //defaults to 100
                  offset,
                ),
              ),
            );

            // Collect results
            for (const page of pages) {
              allItems.push(...page.items);
            }
          }
          // Spotify types are wrong. Make sure this lines up with the fields array.
          return shuffle(allItems).slice(undefined, 100) as unknown as ActualPlaylistedTrack[];
        }
      : skipToken,
  }));

  const countdownHandler = async () => {
    if (tracksQuery.data === undefined || (store.iterator !== undefined && store.iterator <= 0)) {
      return;
    }
    const currentIterator =
      store.iterator === undefined ? tracksQuery.data.length : store.iterator - 1;

    const audioBlob = await queryClient.ensureQueryData(hottestNumberQueryOptions(currentIterator));

    // Play the hottest 100 counter.
    setDisabled(true);
    await playNumber(audioBlob);
    setDisabled(false);

    // set the starting number
    if (store.iterator === undefined) {
      setStore("iterator", tracksQuery.data.length);
    } else {
      setStore("iterator", (prev) => (prev !== undefined ? prev - 1 : undefined));
    }

    // play the actual track, the device id will default to the active device (the current device), and an empty string keeps the types happy
    // TODO: try with retries? this returned 502 once
    await spotifyQuery.data?.player.startResumePlayback("", undefined, [
      tracksQuery.data.at(currentIterator - 1)?.track.uri ?? "",
    ]);
    const nextIterator = currentIterator - 1;
    if (nextIterator < 0) {
      return;
    }
    void queryClient.prefetchQuery(hottestNumberQueryOptions(nextIterator));
  };

  const [showSpoilers, setShowSpoilers] = createSignal(false);
  return (
    <>
      <Toolbar
        startCountdown={countdownHandler}
        paused={paused}
        view={view}
        setView={setView}
        showSpoilers={showSpoilers}
        setShowSpoilers={setShowSpoilers}
        disabled={disabled}
        tracks={tracksQuery.data}
      />
      <Suspense>
        <div class="mt-8 flex min-h-0 flex-1 gap-2 overflow-hidden">
          <div class="w-2/5 overflow-y-auto">
            <Show when={view() === "list"}>
              <ListView tracks={tracksQuery.data} showSpoilers={showSpoilers} />
            </Show>
            <Show when={view() === "compact-list"}>
              <CompactListView tracks={tracksQuery.data} showSpoilers={showSpoilers} />
            </Show>
          </div>
          <div class="flex-1 overflow-y-auto">
            <StatsView tracks={tracksQuery.data} showSpoilers={showSpoilers} />
          </div>
        </div>
      </Suspense>
    </>
  );
};

const Toolbar: Component<{
  startCountdown: () => void;
  paused: Accessor<boolean>;
  view: Accessor<"list" | "compact-list" | "stats">;
  setView: (v: "list" | "compact-list" | "stats") => void;
  showSpoilers: Accessor<boolean>;
  setShowSpoilers: (v: boolean) => void;
  disabled: Accessor<boolean>;
  tracks: ActualPlaylistedTrack[] | undefined;
}> = (props) => {
  const [store] = useGlobalContext();
  return (
    <div class="flex w-full flex-row items-center px-4 py-4">
      <div class="flex justify-start">
        <div class="flex flex-row divide-gray-600 overflow-hidden rounded-md border border-gray-600 bg-white">
          <button
            class={`px-4 py-2 first:rounded-l-md focus:outline-none ${props.view() === "list" ? "bg-slate-600" : "bg-white"}`}
            onClick={() => props.setView("list")}
          >
            <List class={props.view() === "list" ? "text-white" : "text-gray-600"} />
          </button>
          <button
            class={`px-4 py-2 focus:outline-none ${props.view() === "compact-list" ? "bg-slate-600" : "bg-white"}`}
            onClick={() => props.setView("compact-list")}
          >
            <GalleryVertical
              class={props.view() === "compact-list" ? "text-white" : "text-gray-600"}
            />
          </button>
        </div>
      </div>
      <div class="flex flex-1 justify-center">
        {/* TODO: Disable this button when the coundown audio is playing*/}
        <button
          disabled={props.disabled()}
          onClick={() => {
            if (store.iterator === undefined) {
              props.startCountdown();
            } else {
              void player()?.togglePlay();
            }
          }}
        >
          <Show when={props.paused()}>
            <Play class="text-gray-600" />
          </Show>
          <Show when={!props.paused()}>
            <Pause class="text-gray-600" />
          </Show>
        </button>
      </div>
      <div class="flex justify-end gap-2">
        <Trash2Icon onClick={() => alert("Persisted storage coming soon!")} />
        <ExportButton tracks={props.tracks} />
        {import.meta.env.DEV &&
          //  Only allow cheating in development
          (props.showSpoilers() ? (
            <EyeIcon onClick={() => props.setShowSpoilers(false)} />
          ) : (
            <EyeOffIcon onClick={() => props.setShowSpoilers(true)} />
          ))}
      </div>
    </div>
  );
};

export type ViewProps = {
  tracks: ActualPlaylistedTrack[] | undefined;
  showSpoilers: Accessor<boolean>;
};
