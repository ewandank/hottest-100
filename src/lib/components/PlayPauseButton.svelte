<script>
    import { Play, Pause } from "lucide-svelte";
    export let playing;
</script>

<button on:click>
    {#if playing === true}
        <Pause color="#ffffff"/>
    {:else if playing === false}
        <Play color="#ffffff"/>
    {/if}
</button>

<style>
button{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 70px;
    height: 70px;
    background-color: black;
    border-width: 0px;
    border-radius: 50%;

}
</style>
