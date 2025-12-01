<script lang="ts">
    export let title: string;
    export let onClick: () => void;
    export let selected: boolean = false;
</script>

<button class="asset-button" on:click={onClick} class:selected>
    { title }
</button>