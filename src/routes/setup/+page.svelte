<script>
    import { goto } from "$app/navigation";

    export let data;
    const userPlaylists = data.userPlaylists.items;
    let selectedPlaylist;
    function onStart() {
        console.log(selectedPlaylist);
        goto("/player/" + selectedPlaylist.id);
    }
</script>

<h1>Setup Page</h1>
<select bind:value={selectedPlaylist}>
    <option selected disabled>Please select a playlist to shuffle...</option>
    {#each userPlaylists as playlist}
        <option value={playlist}>{playlist.name}</option>
    {/each}
</select>
<!-- TODO: IMPLEMENT BUTTON -->
<!-- <input placeholder="NOT IMPLEMENTED"/> -->
<button on:click={onStart}>Let's go</button>
