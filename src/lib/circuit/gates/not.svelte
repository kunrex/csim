<script lang="ts">
    import type { GateData } from "$lib/circuit";

    import InputHandle from '../handles/input-handle.svelte';
    import OutputHandle from '$lib/circuit/handles/output-handle.svelte';

    export let data: GateData;
    export let dragging = false;
    export let selected = false;
</script>

<div class="node" class:dragging class:selected>
    <InputHandle id="in-1" enabled={data['in-1']} connected={data["in-1-connected"]}/>
    <div>
        <b>Not</b>
    </div>
    <OutputHandle id="out-1" enabled={data['out-1']}/>
</div>

<style>
    .node {
        background-color: var(--color-not);
    }
</style>