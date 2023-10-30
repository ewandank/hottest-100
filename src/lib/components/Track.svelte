<script>
    import { fade } from "svelte/transition";
    export let name;
    export let artists;
    export let album;
    export let hottest_100_number;
    export let playing;
    $: artistsList = artists
        .map((artist, index) => {
            if (index === artists.length - 1) {
                return artist.name;
            } else {
                return artist.name + ", ";
            }
        })
        .join("");
</script>

<div class="container" transition:fade>
    <div class="number-wrapper">
        <p class="number">{hottest_100_number}</p>
        <!-- could put a gif here, but think it will look tacky -->
        <!-- {#if playing}
            <p>Playing now!</p>
        {/if} -->
    </div>
    <div class="img-container">
        <img src={album.images[1].url} alt="Album Artwork for {album.name}" />
    </div>
    <div class="details-container">
        <p><strong>{name}</strong></p>
        <p>{artistsList}</p>
    </div>
</div>

<style>
    p {
        font-size: var(--font-size-5);
    }

    .details-container{
        margin-left:10px;
    }
    .number{
        font-size: var(--font-size-8);
        font-weight: bold;
    }
    .container{
        display: flex;
        padding:10px;
        border-bottom: 3px solid white;
    }
    .img-container{}
    img{
        width:150px;
        height: 150px;
        margin: auto 0;
    }
    .number-wrapper{
        min-width: 110px;
    }
</style>
