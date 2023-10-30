<script>
    import { fade } from "svelte/transition";
    export let name;
    export let artists;
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
<div>
    <p class="number"><strong>{hottest_100_number}</strong>. </p>
    <p transition:fade><strong>{artistsList}</strong> - {name}</p>
</div>

<style>
    .number{
        min-width:3rem;
    }
    div{
        display: flex;
        flex-direction: row;
        padding-bottom:5px;
        text-align: left;
    }
    p {
        font-size: var(--font-size-3);
    }
</style>
