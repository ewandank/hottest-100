import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function millisToMinutesAndSeconds(millis: number) {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  // @ts-expect-error i think this is abusing teh loosy goosy nature
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}
