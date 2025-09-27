import type { PlaylistedTrack, SpotifyApi } from "@spotify/web-api-ts-sdk";
import {
  createEffect,
  createResource,
  createSignal,
  type Component,
  Show,
  type Accessor,
  For,
  onCleanup,
} from "solid-js";
import { createSpotify } from "../signals/createSpotify";
import { debounce, shuffle, playNumber } from "../utils";
import Pause from "lucide-solid/icons/pause";
import Play from "lucide-solid/icons/play";
import List from "lucide-solid/icons/list";
import ChartNetwork from "lucide-solid/icons/chart-network";
import GalleryVertical from "lucide-solid/icons/gallery-vertical";
import { createDelayedSignal } from "../signals/createDelayedSignal";
import { TrackView } from "./tracks/track-list-view";
import { CompactTrackView } from "./tracks/compact-track";
import { useGlobalContext } from "../context/context";

const [view, setView] = createSignal<"list" | "compact-list" | "stats">("list");
const [player, setPlayer] = createSignal<Spotify.Player | null>(null);

export const CountdownPlayer: Component = () => {
  const [store, setStore] = useGlobalContext();
  createEffect(() => {
    // Wait for authorization before injecting the SDK script
    const sdk = spotify();
    sdk?.getAccessToken().then((token) => {
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
  const spotify = createSpotify("http://localhost:5173/player");

  createEffect(() => {
    (async () => {
      if (spotify() === null) {
        return;
      }

      window.onSpotifyWebPlaybackSDKReady = () => {
        const internalPlayer = new window.Spotify.Player({
          name: "Hottest 100 Player",
          getOAuthToken: (cb) => {
            spotify()
              ?.getAccessToken()
              // Cheeky non-null assert
              .then((token) => cb(token!.access_token));
          },
          // just go full volume, use your systems volume if you want that.
          volume: 1,
        });
        internalPlayer.connect();
        setPlayer(internalPlayer);
        internalPlayer.addListener("ready", async ({ device_id }) => {
          await spotify()?.player.transferPlayback([device_id]);
          try {
            await spotify()?.player.setRepeatMode("off", device_id);
          } catch (e) {
            if (e instanceof SyntaxError) {
              // Ignore it
            }
          }
        });
        internalPlayer.addListener(
          "player_state_changed",
          debouncedHandlePlayerStateChange,
        );
        internalPlayer.addListener("player_state_changed", handlePauseState);
      };
    })();
  });
  const [paused, setPaused] = createSignal(true);
  const handlePauseState = (state: Spotify.PlaybackState) =>
    setPaused(state.paused);
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

  const debouncedHandlePlayerStateChange = debounce(
    handlePlayerStateChange,
    20,
  );

  const [tracks] = createResource(spotify, async () => {
    const playlistId = store.playlistId;
    if (!playlistId) return [];
    if (!spotify()) return [];

    // First call just to discover total number of tracks
    const firstPage = await spotify()!.playlists.getPlaylistItems(
      playlistId,
      undefined,
      "items(added_by(id),track(name,album(images),artists(name),uri)),total",
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
          spotify()!.playlists.getPlaylistItems(
            playlistId,
            undefined,
            "items(added_by(id),track(name,album(images),artists(name),uri))",
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
    return shuffle(allItems).slice(undefined, 100);
  });

  const countdownHandler = async () => {
    if (tracks() === undefined) {
      return;
    }
    if (store.iterator! <= 0) {
      return;
    }
    // set the starting number
    if (store.iterator === undefined) {
      setStore("iterator", tracks()!.length);
    } else {
      setStore("iterator", (prev) =>
        prev !== undefined ? prev - 1 : undefined,
      );
    }
    // Play the hottest 100 counter.
    if (store.iterator !== undefined) {
      await playNumber(`/numbers/${store.iterator}.mp3`);
    }

    // play the actual track, the device id will default to the active device (the current device), and an empty string keeps the types happy
    // TODO: try with retries? this returned 502 once
    await spotify()?.player.startResumePlayback("", undefined, [
      tracks()?.at(store.iterator! - 1)?.track.uri ?? "",
    ]);
  };

  return (
    <div class="bg-jjj-gradient flex justify-center min-h-screen">
      <div class="w-3/5 bg-transparent">
        <Toolbar
          startCountdown={countdownHandler}
          paused={paused}
          view={view}
          setView={setView}
        />
        <div class="mt-8">
          <Show when={view() === "list"}>
            <ListView tracks={tracks} spotify={spotify} />
          </Show>
          <Show when={view() === "compact-list"}>
            <CompactListView
              tracks={tracks}
              spotify={spotify}
            />
          </Show>
          <Show when={view() === "stats"}>
            <StatsView tracks={tracks} spotify={spotify} />
          </Show>
        </div>
      </div>
    </div>
  );
};

const Toolbar: Component<{
  startCountdown: () => void;
  paused: Accessor<boolean>;
  view: Accessor<"list" | "compact-list" | "stats">;
  setView: (v: "list" | "compact-list" | "stats") => void;
}> = (props) => {
  const [store] = useGlobalContext();
  return (
    <div class="flex flex-row w-full pt-8 pb-4">
      <div class="flex-1 flex justify-center">
        <button
          onClick={() => {
            if (store.iterator === undefined) {
              props.startCountdown();
            } else {
              player()?.togglePlay();
            }
          }}
        >
          <Show when={props.paused() === true}>
            <Play class="text-gray-600" />
          </Show>
          <Show when={props.paused() === false}>
            <Pause class="text-gray-600" />
          </Show>
        </button>
      </div>
      <div class="flex justify-end pr-4">
        <div class="flex flex-row rounded-md overflow-hidden divide-gray-600 border border-gray-600 bg-white">
          <button
            class={`px-4 py-2 focus:outline-none first:rounded-l-md ${props.view() === "list" ? "bg-slate-600" : "bg-white"}`}
            onClick={() => props.setView("list")}
          >
            <List
              class={props.view() === "list" ? "text-white" : "text-gray-600"}
            />
          </button>
          <button
            class={`px-4 py-2 focus:outline-none ${props.view() === "compact-list" ? "bg-slate-600" : "bg-white"}`}
            onClick={() => props.setView("compact-list")}
          >
            <GalleryVertical
              class={
                props.view() === "compact-list" ? "text-white" : "text-gray-600"
              }
            />
          </button>
          <button
            class={`px-4 py-2 focus:outline-none last:rounded-r-md ${props.view() === "stats" ? "bg-slate-600" : "bg-white"}`}
            onClick={() => props.setView("stats")}
          >
            <ChartNetwork
              class={props.view() === "stats" ? "text-white" : "text-gray-600"}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

type ViewProps = {
  tracks: Accessor<PlaylistedTrack[] | undefined>;
  spotify: () => SpotifyApi;
};

const ListView = (props: ViewProps) => {
  const [store] = useGlobalContext();
  // TODO: would be nice if I could delay this based on the length of the song. This will implode if the song is <30 seconds.
  // TODO: undo me back to 30, its annoying af for debugging though.
  const delayedIterator = createDelayedSignal(() => store.iterator, 0);
  return (
    <div class="p-8">
      <For each={props.tracks()}>
        {(track, index) => (
          <Show when={delayedIterator() <= index() + 1}>
            {/* TODO: BAD PROP DRILLING */}
            <TrackView
              track={track}
              idx={index() + 1}
              spotify={props.spotify}
            />
          </Show>
        )}
      </For>
    </div>
  );
};

const CompactListView = (props: ViewProps) => {
  const [store] = useGlobalContext();
  // TODO: would be nice if I could delay this based on the length of the song. This will implode if the song is <30 seconds.
  // TODO: undo me back to 30, its annoying af for debugging though.
  const delayedIterator = createDelayedSignal(() => store.iterator, 0);
  return (
    <div class="p-8">
      <For each={props.tracks()}>
        {(track, index) => (
          <Show when={delayedIterator() <= index() + 1}>
            {/* TODO: BAD PROP DRILLING */}
            <CompactTrackView
              track={track}
              idx={index() + 1}
              spotify={props.spotify}
            />
          </Show>
        )}
      </For>
    </div>
  );
};

const StatsView = (props: ViewProps) => {
  // const [userName] = createResource(
  //   () => [props.spotify(), props.track.added_by.id],
  //   ([sdk, userId]) => getUserDisplayName(sdk, userId),
  // );
  // Count songs per person
  const counts = () => {
    const internalCounts: Record<string, number> = {};
    props.tracks()?.forEach((track) => {
    const name = track.added_by?.id ?? undefined;
    internalCounts[name] = (internalCounts[name] || 0) + 1;
  });
  }
 

  return (
    <div class="p-8">
      <table class="min-w-[300px] bg-white rounded shadow">
        <thead>
          <tr>
            <th class="text-left px-4 py-2 border-b">Person</th>
            <th class="text-left px-4 py-2 border-b">Number of Songs</th>
          </tr>
        </thead>
        <tbody>
          <For each={Object.entries(counts)}>
            {([person, num]) => (
              <tr>
                <td class="px-4 py-2 border-b">
                  {person !== undefined ? person : "Unknown"}
                </td>
                <td class="px-4 py-2 border-b">{num}</td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
};
