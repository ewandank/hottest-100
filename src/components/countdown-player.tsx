import type { Track } from "@spotify/web-api-ts-sdk";
import {
  createEffect,
  createResource,
  createSignal,
  type Component,
} from "solid-js";
import { createSpotify } from "../resources/createSpotify";
import { debounce, shuffle, playNumber } from "../utils";

// stricly speaking, the playlist won't ever change but i don't think passing in the signal hurts.
export const CountdownPlayer: Component<{ playlistId: () => string  }> = (
  props,
) => {


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
          // TODO: this doesn't repspond with json????
          await spotify()?.player.setRepeatMode("off", device_id);
        });
        internalPlayer.addListener(
          "player_state_changed",
          debouncedHandlePlayerStateChange,
        );
      };
    })();
  });

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
    const playlistId = props.playlistId();
    if (!playlistId) return [];
    let allItems: Track[] = [];
    let next: string | null = null;
    if (!spotify()) return [];
    do {
      const response = await spotify()!.playlists.getPlaylistItems(
        playlistId,
        undefined,
        undefined,
        undefined,
        allItems.length,
      );
      if (response && response.items) {
        // TODO typescript is mad.
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
    } else {
      setIterator((prev) => (prev = prev! - 1));
    }
    // Play the hottest 100 counter.
    await playNumber(`/numbers/${iterator()}.mp3`);

    // play the actual track, the device id will default to the active device (the current device), and an empty string keeps the types happy
    await spotify()?.player.startResumePlayback("", undefined, [
      tracks()?.at(iterator()! - 1)?.track.uri,
    ]);
  };

  return (
    <>
      <button onClick={countdownHandler}>Get farked</button>
    </>
  );
};
