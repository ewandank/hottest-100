<script>
    import { Play, Pause } from "lucide-svelte";
    export let playing;
    export let disabled =false;
</script>

<button on:click disabled={disabled}>
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
    background-color: gray;
    border-width: 0px;
    border-radius: 50%;

}
</style>
