import { createSignal, createEffect } from "solid-js";
import type { Accessor } from "solid-js";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const createDelayedSignal = <T>(
  source: () => T,
  ms: number,
): Accessor<T> => {
  const [delayed, setDelayed] = createSignal(source());

  createEffect(() => {
    const value = source();
    delay(ms).then(() => setDelayed(() => value));
  });

  return delayed;
};
