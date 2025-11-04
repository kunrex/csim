<script lang="ts">
    export let enabled = false;
</script>

<div class="horizontal rounded-xs" class:enabled></div>

<style>
    .horizontal {
        width: var(--segment-width);
        height: var(--segment-height);
        background-color: white;
    }

    .horizontal.enabled {
        background-color: red;
    }
</style>


