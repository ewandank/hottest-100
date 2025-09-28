import { For, Show } from "solid-js";
import { useGlobalContext } from "../../context/context";
import { createDelayedSignal } from "../../signals/createDelayedSignal";
import { CompactTrackView } from "../tracks/compact-track";
import type { ViewProps } from "../countdown-player";

export const CompactListView = (props: ViewProps) => {
  const [store] = useGlobalContext();
  const delayedIterator = createDelayedSignal(() => store.iterator, 30_000);
  const currentIndex = () => (props.showSpoilers() ? 0 : delayedIterator());

  return (
    <div class="p-8">
      <For each={props.tracks()}>
        {(track, index) => (
          <Show when={currentIndex() <= index() + 1}>
            <CompactTrackView
              track={track}
              idx={index() + 1}
              spotify={props.spotify}
            />
          </Show>
        )}
      </For>
    </div>
  );
};

