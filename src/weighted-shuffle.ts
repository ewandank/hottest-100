/**
 * Performs a weighted random shuffle returning `n` unique items.
 * Duplicates in the input array represent weights.
 *
 * @template T - Type of elements in the input array
 * @param arr - Input array where duplicate values represent weight
 * @param n - Number of unique items to return
 * @returns Array of `n` weighted randomly selected unique items
 */
export function weightedShuffle<T>(arr: T[], n: number, randomAlg = Math.random): T[] {
  const result: T[] = [];
  const weights = buildFrequencyMap(arr);
  const count = Math.min(n, weights.size);

  // 2. Sample without replacement
  for (let i = 0; i < count; i++) {
    let totalWeight = 0;
    for (const weight of weights.values()) {
      totalWeight += weight;
    }

    let random = randomAlg() * totalWeight;

    for (const [item, weight] of weights.entries()) {
      random -= weight;
      if (random < 0) {
        result.push(item);
        weights.delete(item); // Remove picked item to ensure uniqueness
        break;
      }
    }
  }

  return result;
}

const buildFrequencyMap = <T>(items: T[]): Map<T, number> => {
  const weights = new Map<T, number>();
  for (const item of items) {
    weights.set(item, (weights.get(item) ?? 0) + 1);
  }
  return weights;
};
