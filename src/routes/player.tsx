import { createFileRoute, useSearch } from "@tanstack/solid-router";
import {
  createEffect,
  createResource,
  createSignal,
  For,
  onMount,
} from "solid-js";
import { createSpotify } from "../resources/createSpotify";
import { playNumber, shuffle } from "../utils";
import type { Track, TrackItem } from "@spotify/web-api-ts-sdk";

export const Route = createFileRoute("/player")({
  component: RouteComponent,
});

interface PlayerSearch {
  playlistId?: string;
}

function RouteComponent() {
  const [player, setPlayer] = createSignal<Spotify.Player | null>(null);
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
  // TODO

  const spotify = createSpotify(
    import.meta.env.VITE_CLIENT_ID,
    "http://localhost:5173/",
    [
      "playlist-read-private",
      "user-modify-playback-state",
      "streaming",
      "user-read-email",
      "user-read-private",
    ],
  );

  const search = useSearch({ strict: false });

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
          volume: 0.5,
        });
        internalPlayer.connect();
        setPlayer(internalPlayer);
        internalPlayer.addListener("ready", async ({ device_id }) => {
          await spotify()?.player.transferPlayback([device_id]);
          internalPlayer.setVolume(1);
          // await spotify()?.player.setRepeatMode("off", device_id);
        });
      };
    })();
  });

  const [tracks] = createResource(spotify, async () => {
    const playlistId = search().playlistId;
    if (!playlistId) return [];
    let allItems: Track[] = [];
    let next: string | null = null;
    let sdk = spotify();
    if (!sdk) return [];
    do {
      const response = await sdk.playlists.getPlaylistItems(
        playlistId,
        undefined,
        undefined,
        undefined,
        allItems.length,
      );
      if (response && response.items) {
        // TODO
        allItems = allItems.concat(response.items);
        next = response.next;
      } else {
        next = null;
      }
    } while (next);
    const shuffledTracks = shuffle(allItems);
    return shuffledTracks;
  });

  const [iterator, setIterator] = createSignal<number>();
  const countdownHandler = async () => {
    if (tracks() === undefined) {
      return;
    }
    // set the starting number
    if (iterator() === undefined) {
      setIterator(tracks()!.length <= 100 ? tracks()?.length : 100);
    }
    await playNumber(`/numbers/${iterator()}.mp3`)

  };

  return (
    <>
      <button onClick={countdownHandler}>Get farked</button>
      <For each={tracks()}>{(item, index) => <p>{item.track.name}</p>}</For>
    </>
  );
}
