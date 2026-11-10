import { createFileRoute } from "@tanstack/solid-router";

import { CountdownPlayer } from "./-countdown-player";

export const Route = createFileRoute("/player/$playlistId")({
  head: () => ({
    scripts: [{ src: "https://sdk.scdn.co/spotify-player.js" }],
  }),
  component: CountdownPlayer,
});
