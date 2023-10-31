<script>
    import TrackWrapper from "$c/TrackWrapper.svelte";
    import { WebPlayback } from "svelte-spotify-web-playback";
    const client_id = window._env_.CLIENT_ID;
    let spotify;
    const scopes = [
        "playlist-read-private",
        "user-modify-playback-state",
        "streaming",
        "user-read-email",
        "user-read-private",
    ];
</script>

<svelte:head>
    <title>Hottest 100 Player</title>
</svelte:head>
<WebPlayback {client_id} name="Hottest 100 Player" bind:this={spotify} {scopes}>
    <TrackWrapper
        slot="all"
        let:player
        let:state
        let:error
        let:internal
        {player}
        {state}
        {internal}
        {error}
        wrapper={spotify}
    />
</WebPlayback>
