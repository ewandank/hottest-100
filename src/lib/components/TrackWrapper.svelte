<script>
    import { onDestroy } from "svelte";
    import LoginButton from "$c/LoginButton.svelte";
    import PlaylistSelector from "$c/PlaylistSelector.svelte";
    import Track from "$c/Track.svelte";
    import CompactTrack from "$c/CompactTrack.svelte";
    import {
        getPlaylists,
        getTracks,
        playTrack,
        setRepeatMode,
    } from "$lib/spotify/helper.js";
    import { playNumber, debounce } from "$lib/utils.js";
    import PlayPauseButton from "$c/PlayPauseButton.svelte";
    import { fade } from "svelte/transition";
    import ViewSelector from "$c/ViewSelector.svelte";
    export let player;
    export let state;
    export let internal;
    export let error;
    export let wrapper;
    let layout;
    let trackItems = [];
    let iterator;
    let results = [];
    let currentTrack;
    let disableButton = true;
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
                disableButton = true;
                await playNumber(audioSrc);
                currentTrack = trackItems[iterator - 1].track;
                playTrack(currentTrack, accessToken);
                const currentData = {
                    ...currentTrack,
                    playing: true,
                    hottest_100_number: iterator,
                };
                results = [currentData, ...results];
                disableButton = false;
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
    onDestroy(() => {
        player?.disconnect();
    });
    let imgsToPreload = [];
    $: if (iterator > 0) {
        imgsToPreload = trackItems
            .slice(iterator - 1, iterator)
            .map((x) => x.track.album.images[1].url);
    }
</script>

<svelte:head>
    {#each imgsToPreload as image}
        <link rel="preload" as="image" href={image} />
    {/each}
</svelte:head>
{#if !isAuthorized}
    <LoginButton on:click={() => wrapper.login()} />
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
    <!-- TODO: This might be its own component or smth -->
    <div class="nav">
        <PlayPauseButton
            {playing}
            bind:disabled={disableButton}
            on:click={() => player.togglePlay()}
        />
        <ViewSelector bind:value={layout} />
    </div>
    {#if layout === "LIST"}
        <div class="compact-track-wrapper" in:fade={{ duration: 100 }}>
            <div>
                {#each results as data (data.hottest_100_number)}
                    <CompactTrack {...data} />
                {/each}
            </div>
        </div>
    {:else if layout === "GRID"}
        <div class="track-wrapper" in:fade={{ duration: 100 }}>
            {#each results as data (data.hottest_100_number)}
                <div>
                    <Track {...data} />
                </div>
            {/each}
        </div>
    {/if}
{/if}

<style>
    .nav {
        overflow: hidden;
        /* TODO: Ensure smaller windows aren't broken */
        overflow-x: hidden;
        width: 100vw;
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        vertical-align: center;
        gap: 1rem;
    }
    .compact-track-wrapper {
        align-items: center;
        gap: 0rem;
        display: flex;
        flex-direction: column;
        margin-top: 5px;
        min-width: 500px;
        margin: 1em auto 0;
        width: 50%;
        text-align: left;
    }
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
        margin-top: 5px;
    }
    .track-wrapper > * {
        width: 50%;
        min-width: 500px;
        /* margin: 0 auto; */
    }
</style>
