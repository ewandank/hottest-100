import { type Accessor } from "solid-js";

import type { ActualPlaylistedTrack } from "../../types/spotify";

export type StatsComponentProps = {
  tracks: ActualPlaylistedTrack[] | undefined;
  currentIndex: Accessor<number | undefined>;
};
