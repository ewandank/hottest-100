import { type ViewProps } from "./countdown-player";
import { useGlobalContext } from "../context/context";
import { createDelayedSignal } from "../signals/createDelayedSignal";
import { UserCountGraph } from "./stats/UserCountGraph";
import { TopNArtists } from "./stats/TopNArtists";
import { LongestSong } from "./stats/LongestSong";
import { ShortestSong } from "./stats/ShortestSong";
import { BackToBack } from "./stats/BackToBack";
import { SongsByYear } from "./stats/SongsByYear";
import { NewestSong } from "./stats/NewestSong";
import { OldestSong } from "./stats/OldestSong";

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
    <div class="grid h-fit grid-cols-3 gap-5">
      <UserCountGraph spotify={props.spotify} tracks={props.tracks} currentIndex={currentIndex} />
      <TopNArtists spotify={props.spotify} tracks={props.tracks} currentIndex={currentIndex} />
      <LongestSong spotify={props.spotify} tracks={props.tracks} currentIndex={currentIndex} />
      <ShortestSong spotify={props.spotify} tracks={props.tracks} currentIndex={currentIndex} />
      <BackToBack spotify={props.spotify} tracks={props.tracks} currentIndex={currentIndex} />
      <SongsByYear spotify={props.spotify} tracks={props.tracks} currentIndex={currentIndex} />
      <NewestSong spotify={props.spotify} tracks={props.tracks} currentIndex={currentIndex} />
      <OldestSong spotify={props.spotify} tracks={props.tracks} currentIndex={currentIndex} />
    </div>
  );
};
