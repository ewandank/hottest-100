<script>
    import TrackWrapper from "$c/TrackWrapper.svelte";
    import { WebPlayback } from "svelte-spotify-web-playback";
    let spotify;
    let client_id = import.meta.env.PUBLIC_CLIENT_ID;
    const scopes = [
        "playlist-read-private",
        "user-modify-playback-state",
        "streaming",
        "user-read-email",
        "user-read-private",
    ];
</script>
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
