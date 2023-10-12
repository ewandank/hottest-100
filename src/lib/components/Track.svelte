<script>
    export let name;
    export let artists;
    export let album;
    export let hottest_100_number;
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

<div class="container">
    <div class="img-container">
        <img src={album.images[1].url} alt="Album Artwork for {album.name}" />
    </div>
    <div class="number-wrapper">
        <h2>{hottest_100_number}</h2>
    </div>
    <div class="details-container">
        <p class="name">{name}</p>
        <p class="artists">{artistsList}</p>
        <p />
    </div>
</div>

<style>
    p {
        font-size: small;
    }
    .name{
        font-weight: bold;
    }
    .number-wrapper {
        text-align: center;
        width: 80px;
        margin: auto 0px;
    }
    .img-container{
        margin: auto 10px;
    }
    .container {
        background-color: rgb(196, 196, 196);
        display: flex;
        width: 100%;
        height: 120px;
        border: 1px solid rgb(167, 167, 167);
        border-radius: 8px;
    }
    img {
        height: 100px;
        width: 100px;
    }
    * {
        font-family: Verdana, Geneva, Tahoma, sans-serif;
    }
    .details-container {
        margin:auto 0px;
    }
</style>
