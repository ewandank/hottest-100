import { describe, it, expect } from "vitest";

import type { ActualPlaylistedTrack } from "./types/spotify";
import { weightedShuffle } from "./weighted-shuffle";

const track = (uri: string, isrc: string): ActualPlaylistedTrack => ({
  added_by: {
    external_urls: { spotify: "" },
    href: "",
    id: "test-user",
    type: "user",
    uri: "spotify:user:test-user",
  },
  track: {
    uri,
    duration_ms: 180_000,
    name: uri,
    explicit: false,
    album: { images: [], release_date: "2020" },
    artists: [{ name: "Artist" }],
    external_ids: { isrc },
  },
});

describe("weightedShuffle", () => {
  // --- Edge Cases & Basic Functionality ---

  it("returns an empty array on empty input or invalid n", () => {
    expect(weightedShuffle([], 3)).toEqual([]);
    expect(weightedShuffle([track("A", "isrc-a"), track("B", "isrc-b")], 0)).toEqual([]);
    expect(weightedShuffle([track("A", "isrc-a"), track("B", "isrc-b")], -1)).toEqual([]);
  });

  it("returns at most the number of unique items available", () => {
    const input = [
      track("A", "isrc-a"),
      track("A", "isrc-a"),
      track("A", "isrc-a"),
      track("B", "isrc-b"),
    ];
    const result = weightedShuffle(input, 5);

    expect(result).toHaveLength(2);
    expect(result.map((item) => item.track.uri)).toEqual(expect.arrayContaining(["A", "B"]));
  });

  it("returns unique items without duplicate elements in output", () => {
    const input = [
      track("A", "isrc-a"),
      track("A", "isrc-a"),
      track("A", "isrc-a"),
      track("B", "isrc-b"),
      track("B", "isrc-b"),
      track("C", "isrc-c"),
    ];
    const result = weightedShuffle(input, 3);
    const uniqueSet = new Set(result.map((item) => item.track.uri));

    expect(result.length).toBe(uniqueSet.size);
  });

  it("groups distinct objects with the same URI", () => {
    const input = [track("A", "isrc-a"), track("A", "isrc-a"), track("B", "isrc-b")];

    const result = weightedShuffle(input, 2);
    expect(result).toHaveLength(2);
    expect(result.map((item) => item.track.uri)).toEqual(expect.arrayContaining(["A", "B"]));
  });

  it("does not duplicate tracks with different URIs but the same ISRC", () => {
    const result = weightedShuffle(
      [track("first-uri", "shared-isrc"), track("second-uri", "shared-isrc")],
      2,
    );

    expect(result).toHaveLength(1);
    expect(result[0]?.track.external_ids.isrc).toBe("shared-isrc");
  });

  it("returns the highest weighted keys first", () => {
    const randomValues = [0.1, 0.9, 0.5];
    const result = weightedShuffle(
      [track("A", "isrc-a"), track("B", "isrc-b"), track("C", "isrc-c")],
      3,
      () => randomValues.shift() ?? 0,
    );

    expect(result.map((item) => item.track.uri)).toEqual(["B", "C", "A"]);
  });

  // --- Statistical Probability Test ---

  it("biases index 0 towards heavily weighted items", () => {
    // 'A' has weight 8 (80%), 'B' has weight 2 (20%).
    const pool = [
      ...Array.from({ length: 8 }, () => track("A", "isrc-a")),
      ...Array.from({ length: 2 }, () => track("B", "isrc-b")),
    ];
    const iterations = 10_000;
    let aAtIndexZeroCount = 0;

    for (let i = 0; i < iterations; i++) {
      const res = weightedShuffle(pool, 1);
      if (res[0]?.track.uri === "A") {
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
