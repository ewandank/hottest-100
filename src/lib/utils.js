
export const debounce = (func, delay) => {
  let timerId;

  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => func(...args), delay);
  };
};
export function playNumber(src) {
  return new Promise((resolve, reject) => {
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
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

