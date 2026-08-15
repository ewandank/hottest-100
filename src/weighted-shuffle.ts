/**
 * Performs a weighted random shuffle returning `n` unique items.
 * Duplicates in the input array represent weights.
 *
s
 * @param arr - Input array where duplicate values represent weight
 * @param n - Number of unique items to return
 * @returns Array of `n` weighted randomly selected unique items
 */
export function weightedShuffle<T>(arr: T[], n: number, randomAlg = Math.random): T[] {
  const weights = buildFrequencyMap(arr);

  return Array.from(weights.entries())
    .map(([item, weight]) => ({
      item,
      // Calculate key score: Higher weight -> higher chance of a score closer to 1
      key: Math.pow(randomAlg(), 1 / weight),
    }))
    .toSorted((a, b) => b.key - a.key) // Sort highest score to lowest
    .slice(0, n) // Grab the top N winners
    .map((entry) => entry.item);
}
/**
 * From a list of items with duplicates, generate their weights in a map.
 * @param items the items (with duplicates)
 * @returns the map of each unique item to its weight.
 */
const buildFrequencyMap = <T>(items: T[]): Map<T, number> => {
  const weights = new Map<T, number>();
  for (const item of items) {
    weights.set(item, (weights.get(item) ?? 0) + 1);
  }
  return weights;
};
