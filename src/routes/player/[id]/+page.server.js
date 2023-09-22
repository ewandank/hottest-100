export const load = async ({ params, cookies }) => {
    const accessToken = cookies.get('access_token');
    // TODO: redo this such that it catches an unrefreshed token and refreshes it 
    const uri = 'https://api.spotify.com/v1/playlists/' + params.id + '/tracks'
    const response = await fetch(uri, {
        headers: {
            Authorization: "Bearer " + accessToken
        }
    })
    const tracks = await response.json();
    // TODO: Implement Pagination
    let trackItems = tracks.items;
    shuffleArray(trackItems)
    return {trackItems, accessToken}

}
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}