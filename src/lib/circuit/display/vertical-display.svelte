<script lang="ts">
    export let enabled = false;
</script>

<div class="vertical rounded-xs" class:enabled></div>

<style>
    .vertical {
        width: var(--segment-height);
        height: var(--segment-width);
        background-color: white;
    }

    .vertical.enabled {
        background-color: red;
    }
</style>


