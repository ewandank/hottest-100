import { useGlobalContext } from "~/context/context";
import { createDelayedSignal } from "~/signals/createDelayedSignal";
import { formatDateForDisplay, millisToMinutesAndSeconds } from "~/utils";

import { type ViewProps } from "./-countdown-player";
import { BackToBack } from "./-stats/back-to-back";
import { ExtremeSong } from "./-stats/extreme-song";
import { PercentageExplicit } from "./-stats/percentage-explicit";
import { SongsByYear } from "./-stats/songs-by-year";
import { TopNArtists } from "./-stats/top-n-artists";
import { UserCountGraph } from "./-stats/user-count-graph";

export const StatsView = (props: ViewProps) => {
  const [store] = useGlobalContext();
  const delayedIteratorSignal = createDelayedSignal(() => store.iterator, 30_000);
  const currentIndex = () => {
    if (props.showSpoilers()) {
      return 0;
    }
    const iterator = delayedIteratorSignal();
    if (iterator !== undefined) {
      return iterator - 1;
    }
    return props.tracks?.length;
  };

  return (
    <div class="grid h-fit grid-cols-6 gap-5">
      <UserCountGraph tracks={props.tracks} currentIndex={currentIndex} />
      <TopNArtists tracks={props.tracks} currentIndex={currentIndex} />
      <ExtremeSong
        tracks={props.tracks}
        currentIndex={currentIndex}
        order="asc"
        title="Shortest Song"
        sortFn={(a, b) => a.track.duration_ms - b.track.duration_ms}
        displayFn={(track) => millisToMinutesAndSeconds(track.track.duration_ms)}
      />
      <ExtremeSong
        tracks={props.tracks}
        currentIndex={currentIndex}
        order="desc"
        title="Longest Song"
        sortFn={(a, b) => a.track.duration_ms - b.track.duration_ms}
        displayFn={(track) => millisToMinutesAndSeconds(track.track.duration_ms)}
      />
      <SongsByYear tracks={props.tracks} currentIndex={currentIndex} />
      <BackToBack tracks={props.tracks} currentIndex={currentIndex} />
      <PercentageExplicit tracks={props.tracks} currentIndex={currentIndex} />
      <ExtremeSong
        tracks={props.tracks}
        currentIndex={currentIndex}
        order="desc"
        title="Newest Song"
        sortFn={(a, b) => a.track.album.release_date.localeCompare(b.track.album.release_date)}
        displayFn={(track) => formatDateForDisplay(track.track.album.release_date)}
      />
      <ExtremeSong
        tracks={props.tracks}
        currentIndex={currentIndex}
        order="asc"
        title="Oldest Song"
        sortFn={(a, b) => a.track.album.release_date.localeCompare(b.track.album.release_date)}
        displayFn={(track) => formatDateForDisplay(track.track.album.release_date)}
      />
    </div>
  );
};
