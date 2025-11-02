<script lang="ts">
    export let name: string = "";
    export let color: string = "";
    export let onClick = () => {};
</script>

<button on:click={onClick} class="insert-button hover:cursor-pointer hover:opacity-80" style="background-color: { color };">
    <b> { name } </b>
</button>
