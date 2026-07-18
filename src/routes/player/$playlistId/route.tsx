import { createFileRoute } from "@tanstack/solid-router";

import { CountdownPlayer } from "./-countdown-player";

export const Route = createFileRoute("/player/$playlistId")({
  component: CountdownPlayer,
});
