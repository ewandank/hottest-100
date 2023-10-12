export function loadSpotifyPlayer() {
  return new Promise((resolve, reject) => {
    const scriptTag = document.getElementById("spotify-player")

    if (!scriptTag) {
      const script = document.createElement("script")

      script.id = "spotify-player"
      script.type = "text/javascript"
      script.async = false
      script.defer = true
      script.src = "https://sdk.scdn.co/spotify-player.js"
      script.onload = () => resolve()
      script.onerror = error =>
        reject(new Error(`loadScript: ${error.message}`))

      document.head.appendChild(script)
    } else {
      resolve()
    }
  })
}
export async function setDevice(token, deviceId, shouldPlay) {
  return fetch(`https://api.spotify.com/v1/me/player`, {
    body: JSON.stringify({ device_ids: [deviceId], play: shouldPlay }),
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: 'PUT',
  });
}
export function onInterval(callback, milliseconds) {
  const interval = setInterval(callback, milliseconds)

  onDestroy(() => {
    clearInterval(interval)
  })
}

// Debounce function
export function debounce(func, delay) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}



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

