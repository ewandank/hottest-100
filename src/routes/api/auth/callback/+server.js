import { error, redirect } from "@sveltejs/kit"
import {
  BASE_URL,
  SPOTIFY_APP_CLIENT_ID,
  SPOTIFY_APP_CLIENT_SECRET
} from "$env/static/private"

export const GET = async ({ url, cookies, fetch }) => {
  // get code and state from url
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  // console.log(state)
  // get state and code_verifier from cookies
  const storedState =  await cookies.get("spotify_auth_state", {path: '/'})
  // this will freak out if the source and destination url arent teh same, even if its 127.0.0.1 and localhost 
  // check if state and code_verifier are the same as in cookies
  // if not, throw error
  if (state === null || state !== storedState) {
    throw error(400, "state_mismatch")
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${SPOTIFY_APP_CLIENT_ID}:${SPOTIFY_APP_CLIENT_SECRET}`
      ).toString("base64")}`
    },
    body: new URLSearchParams({
      code: code ?? "",
      redirect_uri: `${BASE_URL}/api/auth/callback`,
      grant_type: "authorization_code",
      client_id: SPOTIFY_APP_CLIENT_ID
    })
  })

  const responseJSON = await response.json()
  console.log(responseJSON)
  if (responseJSON.error) {
    throw error(400, responseJSON.error_description)
  }

  // delete state and code_verifier from cookies as we don't need them anymore
  cookies.delete("spotify_auth_state", { path: "/" })
  // set access_token and refresh_token in cookies
  cookies.set("access_token", responseJSON.access_token, { path: "/"})
  cookies.set("refresh_token", responseJSON.refresh_token, { path: "/"})
  cookies.set('expires_in', responseJSON.expires_in, {path: '/'})
  // redirect page
  throw redirect(303, "/")
}
