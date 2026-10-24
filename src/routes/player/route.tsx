import { createFileRoute, redirect } from "@tanstack/solid-router";

import { getSpotifySdk } from "~/spotify-sdk";

export const Route = createFileRoute("/player")({
  beforeLoad: async () => {
    if (new URLSearchParams(window.location.search).has("error")) {
      throw redirect({ to: "/" });
    }

    const sdk = await getSpotifySdk(`${window.location.origin}/player`);

    if (!sdk) {
      throw redirect({ to: "/" });
    }

    return { sdk };
  },
});
