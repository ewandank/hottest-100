import { queryOptions } from "@tanstack/solid-query";

import { getSpotifySdk } from "~/spotify-sdk";

/**
 * A tanstack query. wrapper around a `SpotifyApi` instance
 */
export const spotifyAPIQueryOptions = queryOptions({
  queryKey: ["spotify-api"],
  queryFn: async () => {
    const sdk = await getSpotifySdk();
    if (!sdk) {
      throw new Error("Failed to authenticate with Spotify.");
    }

    return sdk;
  },
});
