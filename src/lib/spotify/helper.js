import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';
//This needs a pretty big refactor. /api/refresh returns the new token, so don't need to pass the cookies in 
export async function playTrack(track, fetch, access_token) {
    const uris = [track.uri];
    let accessToken = access_token;
    let response = await fetch("https://api.spotify.com/v1/me/player/play", {
        method: "PUT",
        headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            uris: uris,
        }),
    });
    if (response.status == 401) {
        let res = await fetch('api/auth/refresh')
        let data = await res.json()
        accessToken = data.access_token

        //probably not fantastic to only refresh once but anywho
        response = await fetch("https://api.spotify.com/v1/me/player/play", {
            method: "PUT",
            headers: {
                Authorization: "Bearer " + accessToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                uris: uris,
            }),
        });
    }
}
export async function getTracks(playlistId, fetch, access_token) {
    const limit = 100; // Number of tracks to fetch per request
    let allTracks = [];
    let accessToken = access_token;
    let nextUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}`;

    while (nextUrl) {
        const response = await fetch(nextUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (response.status == 401) {
            let res = await fetch('/api/auth/refresh')
            let data = await res.json();
            accessToken = data.access_token
        }
        const tracks = await response.json();
        const trackItems = tracks.items;

        if (trackItems.length === 0) {
            // No more tracks to fetch, stop fetching
            break;
        }

        allTracks = allTracks.concat(trackItems);
        nextUrl = tracks.next;
    }

    shuffleArray(allTracks);
    return allTracks;
}

export async function getPlaylists(fetch, access_token) {
    let nextUrl = 'https://api.spotify.com/v1/me/playlists';
    let allPlaylists = [];
    let accessToken = access_token;

    while (nextUrl) {
        const response = await fetch(nextUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (response.status == 401) {
            let res = await fetch('/api/auth/refresh');
            let data = await res.json();
            if(accessToken == undefined){
                break;
            }
            accessToken = data.access_token;
            continue; // Retry the same URL after token refresh
        }

        const userPlaylists = await response.json();
        const items = userPlaylists.items;
        allPlaylists = allPlaylists.concat(items);
        nextUrl = userPlaylists.next;
    }

    return allPlaylists;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


