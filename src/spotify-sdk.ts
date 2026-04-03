import {
  SpotifyApi,
  type SdkOptions,
  AuthorizationCodeWithPKCEStrategy,
} from "@spotify/web-api-ts-sdk";

export async function getSpotifySdk(redirectUrl: string): Promise<SpotifyApi | null> {
  const clientId = import.meta.env.VITE_CLIENT_ID;
  const scopes = [
    "playlist-read-private",
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
