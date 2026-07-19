import { PercentageExplicit } from "~/components/stats/percentage-explicit";

import { BackToBack } from "../../../components/stats/back-to-back";
import { LongestSong } from "../../../components/stats/longest-song";
import { NewestSong } from "../../../components/stats/newest-song";
import { OldestSong } from "../../../components/stats/oldest-song";
import { ShortestSong } from "../../../components/stats/shortest-song";
import { SongsByYear } from "../../../components/stats/songs-by-year";
import { TopNArtists } from "../../../components/stats/top-n-artists";
import { UserCountGraph } from "../../../components/stats/user-count-graph";
import { useGlobalContext } from "../../../context/context";
import { createDelayedSignal } from "../../../signals/createDelayedSignal";
import { type ViewProps } from "./-countdown-player";

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
    <div class="grid h-fit grid-cols-6 gap-5 p-2">
      {/* <UserCountGraph tracks={props.tracks} currentIndex={currentIndex} /> */}
      <TopNArtists tracks={props.tracks} currentIndex={currentIndex} />
      <LongestSong tracks={props.tracks} currentIndex={currentIndex} />
      <ShortestSong tracks={props.tracks} currentIndex={currentIndex} />
      <SongsByYear tracks={props.tracks} currentIndex={currentIndex} />
      <BackToBack tracks={props.tracks} currentIndex={currentIndex} />
      <PercentageExplicit tracks={props.tracks} currentIndex={currentIndex} />
      <NewestSong tracks={props.tracks} currentIndex={currentIndex} />
      <OldestSong tracks={props.tracks} currentIndex={currentIndex} />
    </div>
  );
};
