import { createFileRoute } from "@tanstack/solid-router";
import { Match, Switch } from "solid-js";
import { PlaylistSelector } from "../components/playlist-selector";
import { CountdownPlayer } from "../components/countdown-player";
import { useGlobalContext } from "../context/context";

export const Route = createFileRoute("/player")({
  component: RouteComponent,
});

function RouteComponent() {
  const [store] = useGlobalContext();
  return (
    <Switch>
      <Match when={store.playlistId === undefined}>
        <PlaylistSelector />
      </Match>
      <Match when={store.playlistId !== undefined}>
        <CountdownPlayer />
      </Match>
    </Switch>
  );
}
