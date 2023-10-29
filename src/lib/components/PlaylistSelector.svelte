<script>
    export let playlists;
    export let startCountDown;
    let selectedPlaylist;
    let loading = false;
    async function handleClick() {
        loading = true;
        startCountDown(selectedPlaylist);
    }
</script>

<div class="wrapper">
    <div class="content-wrapper">
        {#if !loading}
            <select bind:value={selectedPlaylist}>
                <option selected disabled value={undefined}
                    >Please select a playlist to shuffle...</option
                >
                {#each playlists as playlist (playlist)}
                    <option value={playlist.id}>{playlist.name}</option>
                {/each}
            </select>
            <button
                disabled={selectedPlaylist === undefined}
                on:click|once={handleClick}>Start the countdown</button
            >
        {:else}
            <h2>loading the playlist...</h2>
        {/if}
    </div>
</div>

<style>
    h2{
        color:black;
    }
    .wrapper {
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        width:100%
    }
    .content-wrapper {
        width: 45%;
    }
    select {
        border:none;
        font-size: 16px;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 10px;
        width: 100%; /* Make the dropdown 100% width */
        background-color: var(--gray-8);

        color: white;
    }
    select:focus {
        outline: none;
    }

    button {
        font-size: 18px;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        background-color: #007bff; /* Blue button background color */
        color: white; /* White text color for the button */
        cursor: pointer;
        width: 100%; /* Make the button 100% width */
    }

    button:disabled {
        background-color: var(--gray-8); /* Gray out disabled button */
        cursor: not-allowed;
    }
</style>
