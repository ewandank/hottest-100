import { For, Show } from "solid-js";

import type { ViewProps } from "../-countdown-player";
import { TrackView } from "../../../../components/tracks/track";
import { useGlobalContext } from "../../../../context/context";
import { createDelayedSignal } from "../../../../signals/createDelayedSignal";

export const ListView = (props: ViewProps) => {
  const [store] = useGlobalContext();
  const delayedIterator = createDelayedSignal(() => store.iterator, 30_000);
  const currentIndex = () => (props.showSpoilers() ? 0 : delayedIterator());
  return (
    <div class="p-8">
      <For each={props.tracks}>
        {(track, index) => (
          <Show when={currentIndex !== undefined && currentIndex()! <= index() + 1}>
            <TrackView track={track} idx={index() + 1} />
          </Show>
        )}
      </For>
    </div>
  );
};
