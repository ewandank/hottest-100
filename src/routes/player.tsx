import { createFileRoute } from "@tanstack/solid-router";
import { createEffect, createSignal, onMount } from "solid-js";
import { createSpotify } from "../resources/createSpotify";


export const Route = createFileRoute("/player")({
  component: RouteComponent,
});

function RouteComponent() {

  const [player, setPlayer] = createSignal<Spotify.Player | null>(null)
  onMount(() => {
    if (!document.getElementById("spotify-sdk")) {
      const script = document.createElement("script");
      script.id = "spotify-sdk";
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);
    }
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
          name: "Web Playback SDK Quick Start Player",
          getOAuthToken: (cb) => {
            spotify()
              ?.getAccessToken()
              .then((token) => cb(token?.access_token));
          },
          volume: 0.5,
        });
        internalPlayer.connect();
        setPlayer(internalPlayer)
      };
      // If SDK is already loaded, trigger manually
      if (window.Spotify && window.Spotify.Player) {
        window.onSpotifyWebPlaybackSDKReady();
      }
    })();
  });

  return <button onClick={() => player()?.togglePlay()}>Get farked</button>
}
