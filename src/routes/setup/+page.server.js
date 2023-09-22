export const load = (async ({ cookies, fetch }) => {
  const accessToken = cookies.get('access_token');
  // TODO: redo this such that it catches an unrefreshed token and refreshes it 
  const response = await fetch('https://api.spotify.com/v1/me/playlists', {
    headers:{
      Authorization:"Bearer " + accessToken
    }
  })
  const userPlaylists = await response.json();
  return { userPlaylists }
})