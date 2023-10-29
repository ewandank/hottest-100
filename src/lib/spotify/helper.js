import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';
import { shuffleArray } from '../utils';
export async function playTrack(track, access_token) {
    const uris = [track.uri];
    let response = await fetch("https://api.spotify.com/v1/me/player/play", {
        method: "PUT",
        headers: {
            Authorization: "Bearer " + access_token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            uris: uris,
        }),
    });
}
export async function getTracks(playlistId, access_token) {
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

export async function getPlaylists(access_token) {
    let nextUrl = 'https://api.spotify.com/v1/me/playlists';
    let allPlaylists = [];

    while (nextUrl) {
        let response = await fetch(nextUrl, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        let userPlaylists = await response.json();
        let items = userPlaylists.items;
        allPlaylists = allPlaylists.concat(items);
        nextUrl = userPlaylists.next;
    }
    return allPlaylists;
}
// will turn off repeat as this breaks the logic to get when the track is ended
export async function setRepeatMode(accessToken, state) {
    const response = await fetch(`https://api.spotify.com/v1/me/player/repeat?state=${state}`, {
        method: "PUT",
        headers: {
            Authorization: "Bearer " + accessToken,
        },
    })
}




