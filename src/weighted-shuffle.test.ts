import { describe, it, expect } from "vitest";

import { weightedShuffle } from "./weighted-shuffle";

describe("weightedShuffle", () => {
  // --- Edge Cases & Basic Functionality ---

  it("returns an empty array on empty input or invalid n", () => {
    expect(weightedShuffle<string>([], 3)).toEqual([]);
    expect(weightedShuffle<string>(["A", "B"], 0)).toEqual([]);
    expect(weightedShuffle<string>(["A", "B"], -1)).toEqual([]);
  });

  it("returns at most the number of unique items available", () => {
    const input = ["A", "A", "A", "B"]; // 2 unique items
    const result = weightedShuffle(input, 5);

    expect(result).toHaveLength(2);
    expect(result).toContain("A");
    expect(result).toContain("B");
  });

  it("returns unique items without duplicate elements in output", () => {
    const input = ["A", "A", "A", "B", "B", "C"];
    const result = weightedShuffle(input, 3);
    const uniqueSet = new Set(result);

    expect(result.length).toBe(uniqueSet.size);
  });

  it("works seamlessly with custom objects using reference equality", () => {
    const itemA = { id: 1, name: "Alpha" };
    const itemB = { id: 2, name: "Beta" };
    const input = [itemA, itemA, itemA, itemB];

    const result = weightedShuffle(input, 2);
    expect(result).toHaveLength(2);
    expect(result).toContain(itemA);
    expect(result).toContain(itemB);
  });

  // --- Statistical Probability Test ---

  it("biases index 0 towards heavily weighted items", () => {
    // 'A' has weight 8 (80%), 'B' has weight 2 (20%)
    const pool = ["A", "A", "A", "A", "A", "A", "A", "A", "B", "B"];
    const iterations = 10_000;
    let aAtIndexZeroCount = 0;

    for (let i = 0; i < iterations; i++) {
      const res = weightedShuffle(pool, 2);
      if (res[0] === "A") {
        aAtIndexZeroCount++;
      }
    }

    const aRatio = aAtIndexZeroCount / iterations;

    // Expected probability for 'A' at index 0 is 80% (0.80)
    // Checks that it falls within a statistically sound tolerance window [0.77, 0.83]
    expect(aRatio).toBeGreaterThan(0.77);
    expect(aRatio).toBeLessThan(0.83);
  });
});
