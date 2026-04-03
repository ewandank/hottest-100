import { type ViewProps } from "./countdown-player";
import { useGlobalContext } from "../context/context";
import { createDelayedSignal } from "../signals/createDelayedSignal";
import { UserCountGraph } from "./stats/user-count-graph";
import { TopNArtists } from "./stats/top-n-artists";
import { LongestSong } from "./stats/longest-song";
import { ShortestSong } from "./stats/shortest-song";
import { BackToBack } from "./stats/back-to-back";
import { SongsByYear } from "./stats/songs-by-year";
import { NewestSong } from "./stats/newest-song";
import { OldestSong } from "./stats/oldest-song";

export const StatsView = (props: ViewProps) => {
  const [store] = useGlobalContext();
  const delayedIteratorSignal = createDelayedSignal(
    () => store.iterator,
    30_000,
  );
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
    <div class="grid h-fit grid-cols-3 gap-5">
      <UserCountGraph
        spotify={props.spotify}
        tracks={props.tracks}
        currentIndex={currentIndex}
      />
      <TopNArtists
        spotify={props.spotify}
        tracks={props.tracks}
        currentIndex={currentIndex}
      />
      <LongestSong
        spotify={props.spotify}
        tracks={props.tracks}
        currentIndex={currentIndex}
      />
      <ShortestSong
        spotify={props.spotify}
        tracks={props.tracks}
        currentIndex={currentIndex}
      />
      <BackToBack
        spotify={props.spotify}
        tracks={props.tracks}
        currentIndex={currentIndex}
      />
      <SongsByYear
        spotify={props.spotify}
        tracks={props.tracks}
        currentIndex={currentIndex}
      />
      <NewestSong
        spotify={props.spotify}
        tracks={props.tracks}
        currentIndex={currentIndex}
      />
      <OldestSong
        spotify={props.spotify}
        tracks={props.tracks}
        currentIndex={currentIndex}
      />
    </div>
  );
};
