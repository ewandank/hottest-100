import { createFileRoute } from "@tanstack/solid-router";
import { PlaylistSelector } from "../components/playlist-selector";

export const Route = createFileRoute("/player/")({
  component: PlaylistSelector,
});
