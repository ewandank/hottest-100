import {
  SpotifyApi,
  type SdkOptions,
  AuthorizationCodeWithPKCEStrategy,
} from "@spotify/web-api-ts-sdk";
import { queryOptions } from "@tanstack/solid-query";

async function authenticate(): Promise<SpotifyApi | null> {
  const redirectUrl = `${window.location.origin}/player`;
  const clientId = import.meta.env.VITE_CLIENT_ID;
  const scopes = [
    "playlist-read-private",
    "playlist-modify-public",
    "playlist-modify-private",
    "user-modify-playback-state",
    "streaming",
    "user-read-email",
    "user-read-private",
  ];
  const config: SdkOptions | undefined = undefined;

  try {
    const auth = new AuthorizationCodeWithPKCEStrategy(clientId, redirectUrl, scopes);
    const sdk = new SpotifyApi(auth, config);
    const { authenticated } = await sdk.authenticate();
    return authenticated ? sdk : null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export const spotifyAPIQueryOptions = queryOptions({
  queryKey: ["spotify-api"],
  queryFn: async () => {
    const sdk = await authenticate();
    if (!sdk) {
      throw new Error("Failed to authenticate with Spotify.");
    }

    return sdk;
  },
});
