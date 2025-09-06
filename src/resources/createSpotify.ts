import { createSignal, onMount } from "solid-js";
import {
  SpotifyApi,
  type SdkOptions,
  AuthorizationCodeWithPKCEStrategy,
} from "@spotify/web-api-ts-sdk";

export function createSpotify(redirectUrl: string) {
  const [spotify, setSpotify] = createSignal<SpotifyApi | null>(null);
  const clientId = import.meta.env.VITE_CLIENT_ID;
  const scopes = [
    "playlist-read-private",
    "user-modify-playback-state",
    "streaming",
    "user-read-email",
    "user-read-private",
  ];
  // here if you need it.
  const config: SdkOptions | undefined = undefined;

  onMount(async () => {
    try {
      const auth = new AuthorizationCodeWithPKCEStrategy(
        clientId,
        redirectUrl,
        scopes,
      );
      const sdk = new SpotifyApi(auth, config);
      const { authenticated } = await sdk.authenticate();
      setSpotify(authenticated ? sdk : null);
    } catch (e) {
      console.error(e);
      setSpotify(null);
    }
  });

  return spotify;
}
