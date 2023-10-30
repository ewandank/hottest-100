<script>
    import { goto } from "$app/navigation";
</script>

<div class="button-wrapper">
    <button on:click>Login with Spotify</button>
    <p>if you just clicked the button, click it again :)</p>
</div>

<style>
    p{
        margin-top: 20px;
        color:white
    }
    .button-wrapper {
        text-align: center;
        margin: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: black;
    }
 
 button {
        padding: 20px 20px;
        color: white;
        font-size: var(--font-size-7);
        font-family: var(--font-family-body);
        cursor: pointer;
        border-radius: 20px;
        border-width: 0px;
        background-color: var(--spotify-green);
    }
</style>
