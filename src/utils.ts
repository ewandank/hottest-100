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

// Helper function to convert YYYY-MM-DD date to DD/MM/YYYY format
export const formatDateForDisplay = (dateStr: string): string => {
  if (!dateStr) {
    return "";
  }

  // Check if the date is in the YYYY-MM-DD format
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [, year, month, day] = match;
    return `${day}/${month}/${year}`;
  }

  // If it's only YYYY format or any other format, return as is
  return dateStr;
};
