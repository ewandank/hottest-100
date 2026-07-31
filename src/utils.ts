import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function playNumber(src: string) {
  return new Promise<void>((resolve, reject) => {
    const audio = new Audio(src);
    audio.addEventListener("ended", () => resolve(), { once: true });
    audio.addEventListener("error", (err) => reject(err), { once: true });
    void audio.play();
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
const pad = (num: number) => String(num).padStart(2, "0");

export function millisToMinutesAndSeconds(millis: number) {
  const totalSeconds = Math.floor(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes} Mins ${pad(seconds)} Secs `;
}

export function getFormattedDate(date = new Date()) {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${year}-${month}-${day}`;
}
