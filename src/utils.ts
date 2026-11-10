export function playNumber(src: string) {
  return new Promise<void>((resolve, reject) => {
    const audio = new Audio(src);
    audio.addEventListener("ended", () => resolve(), { once: true });
    audio.addEventListener("error", (err) => reject(err), { once: true });
    void audio.play();
  });
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

export const formatDateForDisplay = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);

  if (!year) {
    return "";
  }
  return new Intl.DateTimeFormat("en-GB", {
    ...(month && { month: "2-digit" }),
    ...(day && { day: "2-digit" }),
    year: "numeric",
  }).format(new Date(year, (month || 1) - 1, day || 1));
};
