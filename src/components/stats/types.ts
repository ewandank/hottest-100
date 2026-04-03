import { type Accessor } from "solid-js";
import type { SpotifyApi } from "@spotify/web-api-ts-sdk";
import type { ActualPlaylistedTrack } from "../../SpotifyHelper";

export type StatsComponentProps = {
  spotify: Accessor<SpotifyApi | null>;
  tracks: Accessor<ActualPlaylistedTrack[] | undefined>;
  currentIndex: Accessor<number | undefined>;
};
