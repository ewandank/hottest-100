import { createFileRoute, redirect } from "@tanstack/solid-router";

import { getSpotifyApi } from "~/getSpotifyApi";

export const Route = createFileRoute("/player")({
  beforeLoad: async () => {
    if (!isSupportedBrowser()) {
      throw redirect({ to: "/unsupported" });
    }

    if (new URLSearchParams(window.location.search).has("error")) {
      throw redirect({ to: "/" });
    }

    const sdk = await getSpotifyApi();
    if (!sdk) {
      throw redirect({ to: "/" });
    }

    return { sdk };
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
