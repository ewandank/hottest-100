import { createFileRoute, redirect } from "@tanstack/solid-router";

import { spotifyAPIQueryOptions } from "~/query/spotify-api";
import { queryClient } from "~/queryClient";

export const Route = createFileRoute("/player")({
  beforeLoad: async () => {
    if (!isSupportedBrowser()) {
      throw redirect({ to: "/unsupported" });
    }

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

function isSupportedBrowser() {
  const userAgent = navigator.userAgent;
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent);
  const isChrome =
    /Chrome\//i.test(userAgent) && !/Edg\//i.test(userAgent) && !/OPR\//i.test(userAgent);
  const isFirefox = /Firefox\//i.test(userAgent);

  return !isMobile && (isChrome || isFirefox);
}
