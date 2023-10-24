<!--TODO: maybe yeet ssr, im still unsure if this would work with another client accessing it without login thanks to some weird cookie thing -->
<script>
    import {
        loadSpotifyPlayer,
        setDevice,
        debounce,
        playNumber,
    } from "$lib/utils.js";
    import { onDestroy, onMount } from "svelte";
    import {
        playTrack,
        getTracks,
        setRepeatMode,
    } from "$lib/spotify/helper.js";
    import Track from "$lib/components/Track.svelte";
    import LoginButton from "$c/LoginButton.svelte";
    import PlaylistSelector from "$c/PlaylistSelector.svelte";
    let played = [];
    export let data;
    let accessToken = data.accessToken;
    let expiresIn = data.expiresIn;
    let refreshToken = data.refreshToken;
    let selectedPlaylist;
    let loggedIn = accessToken && expiresIn && refreshToken;
    let results = [];
    let currentItems = 10;
    let trackItems = [];
    let currentTrack;
    let userPlaylists = data?.userPlaylists ? data.userPlaylists : [];
    let player;
    let deviceId;
    let iterator;
    let startingNumber;
    let prevState;
    async function startCountDown(playlistID) {
        trackItems = await getTracks(playlistID, fetch, accessToken);
        // TODO: Implement Starting Number
        iterator = trackItems.length < 100 ? trackItems.length : 100;
        counter();
    }
    //TODO: FIX THIS 
    // $: if (expiresIn) {
    //     setInterval(refreshAccessToken, (expiresIn - 60) * 1000);
    // }

    // async function refreshAccessToken() {
    //     console.log("tokenRefresh called");
    //     const res = await fetch("/api/auth/refresh");
    //     const resJSON = await res.json();
    //     expiresIn = resJSON.expires_in;
    //     accessToken = resJSON.access_token;
    // }

    async function counter() {
        if (iterator > 0) {
            const audioSrc = `/numbers/${iterator}.mp3`;
            try {
                if (results.length > 0) {
                    results[0].playing = false;
                }
                await playNumber(audioSrc);
                currentTrack = trackItems[iterator - 1].track;
                playTrack(currentTrack, fetch, accessToken);
                const currentData = {
                    ...currentTrack,
                    playing: true,
                    hottest_100_number: iterator,
                };
                results = [currentData, ...results];
            } catch (error) {
                console.error(`Error playing audio: ${error}`);
            }
            iterator--;
        }
    }
    const debouncedHandlePlayerStateChange = debounce(
        handlePlayerStateChange,
        700
    );
    // const debouncedHandlePlayerStateChange = handlePlayerStateChange;
    async function handlePlayerStateChange(state) {
        if (
            state.track_window.previous_tracks.find(
                (x) => x.uid === state.track_window.current_track.uid
            ) &&
            state.paused
        ) {
            played.push(state.track_window.current_track.id);
            await counter();
        }
    }

    const initializePlayer = () => {
        // We need to wait before auth is initialized then we come here
        results = [];
        player = new window.Spotify.Player({
            getOAuthToken: async (cb) => {
                try {
                    // Make a request to check the status of the user's token
                    const response = await fetch(
                        "https://api.spotify.com/v1/me",
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`, // Use the accessToken variable from the parent scope
                            },
                        }
                    );

                    if (response.status === 200) {
                        // Token is valid
                        cb(accessToken);
                    } else if (response.status === 401) {
                        // Token has expired or is invalid, refresh it
                    } else {
                        // Handle other response status codes as needed
                        console.error(
                            "Unexpected response status:",
                            response.status
                        );
                    }
                } catch (error) {
                    console.error("Error fetching token:", error);
                }
            },
            name: "Hottest 100 Player",
            enableMediaSession: true,
        });
        player.addListener("ready", ({ device_id }) => {
            deviceId = device_id;
            setDevice(accessToken, deviceId, false);
            setRepeatMode(accessToken, "off", deviceId);
        });

        player.addListener("not_ready", ({ device_id }) => {
            deviceId = device_id;
        });

        player.addListener(
            "player_state_changed",
            debouncedHandlePlayerStateChange
        );
        player.addListener("initialization_error", (error) => {
            console.log(error);
        });
        player.addListener("authentication_error", async (error) => {
            let res = await fetch("/api/auth/refresh");
            let ResponseData = await res.json();
            accessToken = ResponseData.access_token;
        });
        // player.addListener("playback_error", (error: WebPlaybackError) => {
        //     handlePlayerError("playback_error", error.message);
        // });

        player.connect();
    };

    onMount(async () => {
        // TODO: only do this if logged in
        if (!window.onSpotifyWebPlaybackSDKReady) {
            window.onSpotifyWebPlaybackSDKReady = initializePlayer;
        } else {
            initializePlayer();
        }
        // Will this cause race conditions?
        await loadSpotifyPlayer();
    });

    onDestroy(() => {
        if (player) player.disconnect();
    });
</script>

{#if loggedIn}
    {#if trackItems.length === 0}
        <PlaylistSelector {startCountDown} playlists={userPlaylists} />
    {:else}
        <div class="track-wrapper">
            {#each results as data (data.hottest_100_number)}
                <div>
                    <Track {...data} />
                </div>
            {/each}
        </div>
    {/if}
{:else}
    <!-- need to login -->
    <LoginButton />
{/if}

<style>
    .track-wrapper {
        align-items: center;
        gap: 0rem;
        display: flex;
        flex-direction: column;
    }
    .track-wrapper > * {
        width: 50%;
        min-width: 500px;
        /* margin: 0 auto; */
    }
</style>
