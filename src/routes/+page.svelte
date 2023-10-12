<!--TODO: maybe yeet ssr, im still unsure if this would work with another client accessing it without login thanks to some weird cookie thing -->
<script>
    import {
        loadSpotifyPlayer,
        setDevice,
        debounce,
        playNumber,
    } from "$lib/utils.js";
    import { onDestroy, onMount } from "svelte";
    import { playTrack, getTracks } from "$lib/spotify/helper.js";
    import { goto } from "$app/navigation";
    import { fly } from "svelte/transition";
    import Track from "$lib/components/Track.svelte";
    let played = [];
    export let data;
    let accessToken = data.accessToken;
    let selectedPlaylist;
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

    async function counter() {
        if (iterator > 0) {
            const audioSrc = `/numbers/${iterator}.mp3`;
            try {
                await playNumber(audioSrc);
                currentTrack = trackItems[iterator - 1].track;
                playTrack(currentTrack, fetch, accessToken);
                const currentData = {
                    ...currentTrack,
                    playing: true,
                    hottest_100_number: iterator,
                };
                // TODO: updating playing state of results[0]
                results = [currentData, ...results];
            } catch (error) {
                console.error(`Error playing audio: ${error}`);
            }
            iterator--;
        }
    }

    // const debouncedHandlePlayerStateChange = debounce(
    //     handlePlayerStateChange,
    //     50
    // );
    // TODO: more comments on this.
    // maybe should remove duplicates as part of the ingestion proccess.
    const debouncedHandlePlayerStateChange = handlePlayerStateChange;

    function handlePlayerStateChange(state) {
        console.log(state);
        if (
            prevState &&
            state.track_window.previous_tracks.find(
                (x) => x.id === state.track_window.current_track.id
            ) &&
            !prevState.paused &&
            state.paused
        ) {
            console.log("Track ended");
            console.log("Next counter fired!");
            played.push(state.track_window.current_track.id);
            counter();
        }
        prevState = state;
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
                        const refreshedToken = await fetch(
                            "/api/auth/refresh"
                        ).then((response) => response.json());
                        cb(refreshedToken.access_token);
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
            name: "Hottest 100 player",
            volume: "0.5",
        });
        player.addListener("ready", ({ device_id }) => {
            deviceId = device_id;
            setDevice(accessToken, deviceId, false);
        });

        player.addListener("not_ready", ({ device_id }) => {
            deviceId = device_id;
        });

        player.addListener(
            "player_state_changed",
            debouncedHandlePlayerStateChange
        );
        // player.addListener(
        //     "initialization_error",
        //     (error: WebPlaybackError) => {
        //         handlePlayerError("initialization_error", error.message);
        //     }
        // );
        player.addListener("authentication_error", async (error) => {
            let res = await fetch("/api/auth/refresh");
            let ResponseData = await res.json();
            accessToken = ResponseData.access_token;
        });
        // player.addListener("playback_error", (error: WebPlaybackError) => {
        //     handlePlayerError("playback_error", error.message);
        // });
        // // Add player to Spotify Connect
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

<!-- need a better way to check if the user token is valid as data.accessToken can exist but not be valid-->
{#if accessToken !== undefined}
    <!-- logged in -->
    {#if trackItems.length === 0}
        <select bind:value={selectedPlaylist}>
            <option selected disabled value={undefined}
                >Please select a playlist to shuffle...</option
            >
            {#each userPlaylists as playlist (playlist)}
                <option value={playlist.id}>{playlist.name}</option>
            {/each}
        </select>
        <button
            disabled={selectedPlaylist === undefined}
            on:click|once={startCountDown(selectedPlaylist)}>SEND ITTTT</button
        >
    {:else}
        <div class="track-wrapper">
            {#each results.slice(0, currentItems) as data (data.hottest_100_number)}
                <div>
                    <Track {...data} />
                </div>
            {/each}
        </div>
        {#if currentItems < results.length}
            <button
                on:click={() => (currentItems = currentItems + 5)}
                id="loadmore"
                type="button"
            >
                Show more
            </button>
        {/if}
    {/if}
{:else}
    <!-- need to login -->
    <button on:click={() => goto("/api/auth/login")}>Login to spotify</button>
{/if}

<style>
    .track-wrapper {
        width: 100%;
        align-items: center;
        gap: 1rem;
        display: grid;
    }
    .track-wrapper > * {
        width: 30%;
        min-width: 500px;
        margin: 0 auto;
    }
</style>
