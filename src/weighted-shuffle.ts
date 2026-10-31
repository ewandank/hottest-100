import type { ActualPlaylistedTrack } from "./types/spotify";

type WeightedTrack = {
  item: ActualPlaylistedTrack;
  weight: number;
};

/**
 * Performs a weighted random shuffle returning up to `n` unique tracks. Tracks with the same ISRC
 * represent weights. The ISRC is the same across multiple recordings.
 *
 * @param arr - Input array where duplicate values represent weight
 * @param n - Number of unique items to return
 * @returns Array of `n` weighted randomly selected unique items
 * @see https://maxhalford.github.io/blog/weighted-sampling-without-replacement/
 * @see https://arxiv.org/pdf/1012.0256
 */
export function weightedShuffle(
  arr: ActualPlaylistedTrack[],
  n: number,
  randomAlg = Math.random,
): ActualPlaylistedTrack[] {
  const weightedTracks = [...buildFrequencyMap(arr).values()];
  const sampleSize = Math.min(Math.max(n, 0), weightedTracks.length);
  if (sampleSize === 0) {
    return [];
  }

  const keyedTracks = weightedTracks.map((entry) => ({
    entry,
    key: randomAlg() ** (1 / entry.weight),
  }));

  keyedTracks.sort((a, b) => b.key - a.key);

  return keyedTracks.slice(0, sampleSize).map(({ entry }) => entry.item);
}

const buildFrequencyMap = (items: ActualPlaylistedTrack[]): Map<string, WeightedTrack> => {
  const weights = new Map<string, WeightedTrack>();
  for (const item of items) {
    const isrc = item.track.external_ids.isrc;
    const entry = weights.get(isrc);
    if (entry) {
      entry.weight += 1;
    } else {
      weights.set(isrc, { item, weight: 1 });
    }
  }
  return weights;
};
