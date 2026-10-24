import { createFileRoute, redirect } from "@tanstack/solid-router";

import { spotifyAPIQueryOptions } from "~/query/spotify-api";
import { queryClient } from "~/queryClient";

export const Route = createFileRoute("/player")({
  beforeLoad: async () => {
    if (new URLSearchParams(window.location.search).has("error")) {
      throw redirect({ to: "/" });
    }

    try {
      const sdk = await queryClient.query(spotifyAPIQueryOptions);
      return { sdk };
    } catch {
      throw redirect({ to: "/" });
    }
  },
});
