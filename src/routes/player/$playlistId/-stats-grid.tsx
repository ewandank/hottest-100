import { PercentageExplicit } from "~/components/stats/percentage-explicit";

import { BackToBack } from "../../../components/stats/back-to-back";
import { ExtremeSong, selectExtremeTrack } from "../../../components/stats/extreme-song";
import { SongsByYear } from "../../../components/stats/songs-by-year";
import { TopNArtists } from "../../../components/stats/top-n-artists";
import { UserCountGraph } from "../../../components/stats/user-count-graph";
import { useGlobalContext } from "../../../context/context";
import { createDelayedSignal } from "../../../signals/createDelayedSignal";
import { formatDateForDisplay, millisToMinutesAndSeconds } from "../../../utils";
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
    <div class="grid h-fit grid-cols-6 gap-5">
      <UserCountGraph tracks={props.tracks} currentIndex={currentIndex} />
      <TopNArtists tracks={props.tracks} currentIndex={currentIndex} />
      <ExtremeSong
        title="Longest Song"
        tracks={props.tracks}
        currentIndex={currentIndex}
        select={selectExtremeTrack(
          (track) => track.track.duration_ms,
          (track) => millisToMinutesAndSeconds(track.track.duration_ms),
          "descending",
        )}
      />
      <ExtremeSong
        title="Shortest Song"
        tracks={props.tracks}
        currentIndex={currentIndex}
        select={selectExtremeTrack(
          (track) => track.track.duration_ms,
          (track) => millisToMinutesAndSeconds(track.track.duration_ms),
        )}
      />
      <SongsByYear tracks={props.tracks} currentIndex={currentIndex} />
      <BackToBack tracks={props.tracks} currentIndex={currentIndex} />
      <PercentageExplicit tracks={props.tracks} currentIndex={currentIndex} />
      <ExtremeSong
        title="Newest Song"
        tracks={props.tracks}
        currentIndex={currentIndex}
        select={selectExtremeTrack(
          (track) => track.track.album.release_date,
          (track) => formatDateForDisplay(track.track.album.release_date),
          "descending",
        )}
      />
      <ExtremeSong
        title="Oldest Song"
        tracks={props.tracks}
        currentIndex={currentIndex}
        select={selectExtremeTrack(
          (track) => track.track.album.release_date,
          (track) => formatDateForDisplay(track.track.album.release_date),
        )}
      />
    </div>
  );
};
