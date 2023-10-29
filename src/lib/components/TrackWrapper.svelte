<script lang="ts">
    // onMount get cookie, if so attempt a login
    
    import LoginButton from "$c/LoginButton.svelte";
    import PlaylistSelector from "$c/PlaylistSelector.svelte";
    import Track from "$c/Track.svelte";
    import {
        getPlaylists,
        getTracks,
        playTrack,
        setRepeatMode,
    } from "$lib/spotify/helper.js";
    import { playNumber, debounce } from "$lib/utils.js";
    import PlayPauseButton from "$c/PlayPauseButton.svelte";
    export let player: WebPlaybackPlayer;
    export let state: WebPlaybackState;
    export let internal: InternalStatus;
    export let error: {
        type: string;
        message: string;
    };
    export let wrapper;
    let trackItems = [];
    let iterator;
    let results = [];
    let currentTrack;
    $: isReady = internal.isReady;
    $: isAuthorized = internal.isAuthorized;
    $: accessToken = internal.accessToken;
    $: playing = !state?.paused;
    async function counter() {
        if (iterator > 0) {
            const audioSrc = `/numbers/${iterator}.mp3`;
            try {
                if (results.length > 0) {
                    results[0].playing = false;
                }
                await playNumber(audioSrc);
                currentTrack = trackItems[iterator - 1].track;
                playTrack(currentTrack, accessToken);
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
    async function startCountDown(playlistID) {
        await setRepeatMode(accessToken, "off");
        trackItems = await getTracks(playlistID, accessToken);
        // TODO: Implement Starting Number
        iterator = trackItems.length < 100 ? trackItems.length : 100;
        counter();
    }
    $: isReady, setupPlayer();
    function setupPlayer() {
        if (isReady === true) {
            wrapper.selectDevice();
        }
    }
    const debouncedHandlePlayerStateChange = debounce(
        handlePlayerStateChange,
        700
    );
    $: state, debouncedHandlePlayerStateChange(state);
    async function handlePlayerStateChange(state) {
        if (state?.track_window) {
            if (
                state.track_window.previous_tracks.find(
                    (x) => x.uid === state.track_window.current_track.uid
                ) &&
                state.paused
            ) {
                await counter();
            }
        }
    }
</script>


{#if isAuthorized === false}
    <LoginButton on:click={() => wrapper.login() } />
{:else if trackItems.length === 0 && accessToken !== ""}
    <div class="playlist-selector">
        {#await getPlaylists(accessToken)}
            <h2>loading your playlists...</h2>
        {:then playlists}
            <PlaylistSelector {startCountDown} {playlists} />
        {:catch error}
            <p>{error}</p>
        {/await}
    </div>
{:else if isReady}
    <div class="track-wrapper">
        <PlayPauseButton {playing} on:click={() => player.togglePlay()} />
        {#each results as data (data.hottest_100_number)}
            <div>
                <Track {...data} />
            </div>
        {/each}
    </div>
{/if}

<style>
    .playlist-selector {
        display: flex;
        height: 100vh;
        width: 100%;
        align-items: center;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .playlist-selector > * {
        margin: auto;
    }
    .track-wrapper {
        align-items: center;
        gap: 0rem;
        display: flex;
        flex-direction: column;
        margin-top:5px;
    }
    .track-wrapper > * {
        width: 50%;
        min-width: 500px;
        /* margin: 0 auto; */
    }
</style>
