<script lang="ts">
    export let name: string = "";
    export let color: string = "";
    export let onClick = () => {};
</script>

<button on:click={onClick} class={`${color} insert-button`}>
    <b> { name } </b>
</button>
