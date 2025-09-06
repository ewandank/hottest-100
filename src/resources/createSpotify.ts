import { createSignal, onMount } from "solid-js";
import {
  SpotifyApi,
  type SdkOptions,
  AuthorizationCodeWithPKCEStrategy,
} from "@spotify/web-api-ts-sdk";

export function createSpotify(clientId: string, redirectUrl: string, scopes: string[], config?: SdkOptions) {
  const [spotify, setSpotify] = createSignal<SpotifyApi | null>(null);

  onMount(async () => {
    try {
      const auth = new AuthorizationCodeWithPKCEStrategy(clientId, redirectUrl, scopes);
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
