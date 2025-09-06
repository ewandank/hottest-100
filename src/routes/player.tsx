import { createFileRoute } from "@tanstack/solid-router";
import { createSignal, Match, Switch, type Accessor } from "solid-js";
import { PlaylistSelector } from "../components/playlist-selector";
import { CountdownPlayer } from "../components/countdown-player";

export const Route = createFileRoute("/player")({
  component: RouteComponent,
});

function RouteComponent() {
  const [playlistId, setPlaylistId] = createSignal<string>();
  return (
    <Switch>
      <Match when={playlistId() === undefined}>
        <PlaylistSelector setPlaylistId={setPlaylistId} />
      </Match>
      <Match when={playlistId() !== undefined}>
        {/* there is literally no way it can be undefined in this case */}
        <CountdownPlayer playlistId={playlistId as Accessor<string>} />
      </Match>
    </Switch>
  );
}
