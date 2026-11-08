import { type Component } from "solid-js";

import type { ActualPlaylistedTrack } from "../../types/spotify";
import { Card, CardContent, CardHeader, CardTitle } from "../Card";
import type { StatsComponentProps } from "./types";

type ExtremeSongSelection = {
  track: ActualPlaylistedTrack;
  detail: string;
};

export const selectExtremeTrack = (
  getValue: (track: ActualPlaylistedTrack) => number | string,
  getDetail: (track: ActualPlaylistedTrack) => string,
  order: "ascending" | "descending" = "ascending",
) => {
  return (tracks: ActualPlaylistedTrack[]): ExtremeSongSelection | undefined => {
    const track = tracks.toSorted((a, b) => {
      const aValue = getValue(a);
      const bValue = getValue(b);
      const comparison =
        typeof aValue === "number" && typeof bValue === "number"
          ? aValue - bValue
          : String(aValue).localeCompare(String(bValue));
      return order === "ascending" ? comparison : -comparison;
    })[0];
    return track ? { track, detail: getDetail(track) } : undefined;
  };
};

type ExtremeSongProps = StatsComponentProps & {
  title: string;
  select: (tracks: ActualPlaylistedTrack[]) => ExtremeSongSelection | undefined;
};

export const ExtremeSong: Component<ExtremeSongProps> = (props) => {
  const selected = () => {
    const tracks = props.tracks?.slice(props.currentIndex()) ?? [];
    return tracks.length ? props.select(tracks) : undefined;
  };

  return (
    <Card class="col-span-3 min-h-52 text-2xl">
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {selected() ? (
          <div class="flex h-full flex-col items-center justify-center text-center">
            <p class="text-3xl font-extrabold text-accent">{selected()!.detail}</p>
            <p class="font-bold">{selected()!.track.track.name}</p>
            <p>
              {selected()!
                .track.track.artists.map((artist) => artist.name)
                .join(", ")}
            </p>
          </div>
        ) : (
          <p class="text-center text-base font-normal">No songs available</p>
        )}
      </CardContent>
    </Card>
  );
};
