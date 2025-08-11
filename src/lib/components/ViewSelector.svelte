<script>
    import { LayoutGrid, List } from "lucide-svelte";
    /**
     * @type {"GRID" | "LIST"}
     */
    export let value = "GRID";
    
    function handleGrid() {
        value = "GRID";
    }
    function handleList() {
        value = "LIST";
    }
</script>

<div>
    <button class:active={value === "GRID"} on:click={handleGrid}>
        <LayoutGrid color={value === "GRID" ? "white" : "gray"} />
    </button>
    <button class:active={value === "LIST"} on:click={handleList}>
        <List color={value === "LIST" ? "white" : "gray"} />
    </button>
</div>

<style>
    button {
        background-color: white;
        padding: 3px;
        border-radius: 3px;
        box-shadow: none;
        border: 0;
    }
    .active {
        background-color: grey;
    }
</style>
