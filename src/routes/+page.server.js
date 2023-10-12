
import { getPlaylists } from '../lib/spotify/helper.js'
export const load = async ({ fetch, params, cookies }) => {
    let accessToken = cookies.get('access_token')
    if (accessToken !== undefined) {

        const userPlaylists = await getPlaylists(fetch, accessToken);
        // get the token again in case it was refreshed
        accessToken = cookies.get('access_token')
        return { userPlaylists, accessToken }
    }
    // get the token again in case it was refreshed
    accessToken = cookies.get('access_token')
    return {accessToken}

}






