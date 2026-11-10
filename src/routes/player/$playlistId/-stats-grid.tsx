import { useGlobalContext } from "~/context/context";

import { createDelayedSignal } from "../../../signals/createDelayedSignal";
import { type ViewProps } from "./-countdown-player";
import { AgedSong } from "./-stats/aged-song";
import { BackToBack } from "./-stats/back-to-back";
import { OldestNewestSong } from "./-stats/oldest-newest-song";
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
      <AgedSong tracks={props.tracks} currentIndex={currentIndex} order="ascending" />
      <AgedSong tracks={props.tracks} currentIndex={currentIndex} order="descending" />
      <SongsByYear tracks={props.tracks} currentIndex={currentIndex} />
      <BackToBack tracks={props.tracks} currentIndex={currentIndex} />
      <PercentageExplicit tracks={props.tracks} currentIndex={currentIndex} />
      <OldestNewestSong tracks={props.tracks} currentIndex={currentIndex} order="descending" />
      <OldestNewestSong tracks={props.tracks} currentIndex={currentIndex} order="ascending" />
    </div>
  );
};
