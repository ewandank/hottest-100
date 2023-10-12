import { redirect } from "@sveltejs/kit"
import pkce from "pkce-gen"
import { BASE_URL, SPOTIFY_APP_CLIENT_ID } from "$env/static/private"

const scope =
  "playlist-read-private user-modify-playback-state streaming user-read-email user-read-private"

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
const challenge = pkce.create()

export const GET = ({ cookies }) => {
  /* set state and code_verifier in cookies so we can use them in callback */
  cookies.set("spotify_auth_state", state)
  cookies.set("spotify_auth_challenger_verifier", challenge.code_verifier)

  throw redirect(
    307,
    `https://accounts.spotify.com/authorize?${new URLSearchParams({
      response_type: "code",
      client_id: SPOTIFY_APP_CLIENT_ID,
      scope,
      redirect_uri: `${BASE_URL}/api/auth/callback`,
      state,
      code_challenge_method: "S256",
      code_challenge: challenge.code_challenge
    })}`
  )
}