<script>
    import { fade } from "svelte/transition";
    export let name;
    export let artists;
    export let album;
    export let hottest_100_number;
    export let playing;
    let artistsList = "";
    $: {
        artistsList = artists
            .map((artist, index) => {
                if (index === artists.length - 1) {
                    return artist.name;
                } else {
                    return artist.name + ", ";
                }
            })
            .join("");
    }
</script>

<div class="container" transition:fade>
    <div class="number-wrapper">
        <p class="number">{hottest_100_number}</p>
        {#if playing}
            <p>Playing now!</p>
        {/if}
    </div>
    <div class="img-container">
        <img src={album.images[1].url} alt="Album Artwork for {album.name}" />
    </div>
    <div class="details-container">
        <p class="name">{name}</p>
        <p class="artists">{artistsList}</p>
        <p />
    </div>
</div>

<style>
    p {
        font-size: var(--font-size-6);
    }
    .name {
        font-weight: bold;
    }
    .number {
        margin-top: 0px;
        font-weight: bold;
        font-size: var(--font-size-8);
    }
    .number-wrapper {
        margin-right: 10px;
        width: 120px;
        margin-top: 8px;
    }
    .container {
        border-bottom: 3px solid white;
        display: flex;
        width: 100%;
        padding: 10px;
    }
    img {
        height: 150px;
        width: 150px;
    }
    .img-container {
        margin-top: 10px;
    }
    .details-container {
        margin-top: 10px;
        margin-left: 15px;
    }
</style>
