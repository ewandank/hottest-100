import {
  SpotifyApi,
  type SdkOptions,
  AuthorizationCodeWithPKCEStrategy,
} from "@spotify/web-api-ts-sdk";
import { queryOptions } from "@tanstack/solid-query";

/**
 * A tanstack query. wrapper around a `SpotifyApi` instance
 */
export const spotifyAPIQueryOptions = queryOptions({
  queryKey: ["spotify-api"],
  queryFn: async () => {
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
    // here if you need it.
    const config: SdkOptions | undefined = undefined;

    const auth = new AuthorizationCodeWithPKCEStrategy(clientId, redirectUrl, scopes);
    const sdk = new SpotifyApi(auth, config);
    const { authenticated } = await sdk.authenticate();
    if (!authenticated) {
      throw new Error("failed to auth");
    }
    return sdk;
  },
});
