import {
  SpotifyApi,
  type SdkOptions,
  AuthorizationCodeWithPKCEStrategy,
} from "@spotify/web-api-ts-sdk";

let spotifyPromise: Promise<SpotifyApi | null> | undefined;

export function getSpotifyApi() {
  if (!spotifyPromise) {
    spotifyPromise = createSpotifyApi();
  }

  return spotifyPromise;
}

async function createSpotifyApi(): Promise<SpotifyApi | null> {
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
  } catch (error) {
    console.error(error);
    return null;
  }
}
