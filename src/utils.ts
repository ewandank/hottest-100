// utils.ts
// Generic, unbiased shuffle implementation (Fisher-Yates)

export function shuffle<T>(array: T[]): T[] {
  const result = array.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function playNumber(src: string) {
  return new Promise<void>((resolve, reject) => {
    const audio = new Audio(src);
    audio.onended = () => {
      resolve();
    };
    audio.onerror = (error) => {
      reject(error);
    };
    audio.play();
  });
}
