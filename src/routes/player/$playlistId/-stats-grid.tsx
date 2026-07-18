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
    return props.tracks()?.length;
  };

  return (
    <div class="grid h-fit grid-cols-6 gap-5 p-2">
      <UserCountGraph spotify={props.spotify} tracks={props.tracks} currentIndex={currentIndex} />
      <TopNArtists spotify={props.spotify} tracks={props.tracks} currentIndex={currentIndex} />
      <LongestSong spotify={props.spotify} tracks={props.tracks} currentIndex={currentIndex} />
      <ShortestSong spotify={props.spotify} tracks={props.tracks} currentIndex={currentIndex} />
      <SongsByYear spotify={props.spotify} tracks={props.tracks} currentIndex={currentIndex} />
      <BackToBack spotify={props.spotify} tracks={props.tracks} currentIndex={currentIndex} />
      <PercentageExplicit
        spotify={props.spotify}
        tracks={props.tracks}
        currentIndex={currentIndex}
      />
      <NewestSong spotify={props.spotify} tracks={props.tracks} currentIndex={currentIndex} />
      <OldestSong spotify={props.spotify} tracks={props.tracks} currentIndex={currentIndex} />
    </div>
  );
};
