import { redirect } from "@sveltejs/kit"
import { BASE_URL, SPOTIFY_APP_CLIENT_ID } from "$env/static/private"

//TODO: I should check this is all i need and if i can remove any of these
const scope =
  "playlist-read-private user-modify-playback-state streaming user-read-email user-read-private"


// used to generate a state 
const generateRandomString = length => {
  let result = ""

  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

  const charactersLength = characters.length

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

const state = generateRandomString(16)

export const GET = async({ url, cookies, fetch }) => {
  await cookies.set("spotify_auth_state", state, {path: '/'})
  throw redirect(
    307,
    `https://accounts.spotify.com/authorize?${new URLSearchParams({
      response_type: "code",
      client_id: SPOTIFY_APP_CLIENT_ID,
      scope,
      redirect_uri: `${BASE_URL}/api/auth/callback`,
      state,
    })}`
  )
}
