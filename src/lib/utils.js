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
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    });
  }