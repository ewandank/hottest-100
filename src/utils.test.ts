import { describe, expect, it } from "vitest";

import { millisToMinutesAndSeconds } from "./utils";

describe("millisToMinutesAndSeconds", () => {
  const cases = [
    { millis: 0, expected: "0 Mins 00 Secs " },
    { millis: 59000, expected: "0 Mins 59 Secs " },
    { millis: 59999, expected: "0 Mins 59 Secs " },
    { millis: 60000, expected: "1 Mins 00 Secs " },
    { millis: 61000, expected: "1 Mins 01 Secs " },
    { millis: 299000, expected: "4 Mins 59 Secs " },
    { millis: 299999, expected: "4 Mins 59 Secs " },
    { millis: 300000, expected: "5 Mins 00 Secs " },
    { millis: 300001, expected: "5 Mins 00 Secs " },
  ];

  it.for(cases)("should return $expected for $millis ms", ({ millis, expected }) => {
    expect(millisToMinutesAndSeconds(millis)).toBe(expected);
  });
});
