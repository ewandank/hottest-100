
import { getPlaylists } from '../lib/spotify/helper.js'
export const load = async ({ fetch, params, cookies }) => {
    let accessToken = cookies.get('access_token')
    let expiresIn = cookies.get("expires_in")
    let refreshToken = cookies.get("refresh_token")
    if (accessToken !== undefined) {

        const userPlaylists = await getPlaylists(fetch, accessToken);
        // get the token again in case it was refreshed
        accessToken = cookies.get('access_token')
        if(userPlaylists == null ){
            return null;
        }
        return { userPlaylists, accessToken,expiresIn,refreshToken}
    }
    // get the token again in case it was refreshed
    
    accessToken = cookies.get('access_token')
    return {accessToken}

}






