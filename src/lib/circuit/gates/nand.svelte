<script lang="ts">
    import type { GateData } from "$lib/circuit";
    import { topRight, bottomRight } from "$lib/circuit/constants";

    import InputHandle from '../handles/input-handle.svelte';
    import OutputHandle from '$lib/circuit/handles/output-handle.svelte';

    export let data: GateData;
    export let dragging = false;
    export let selected = false;
</script>

<div class="node" class:dragging class:selected>
    <InputHandle id="in-1" style="{topRight}" enabled={data['in-1']} connected={data["in-1-connected"]}/>
    <InputHandle id="in-2" style="{bottomRight}" enabled={data['in-2']} connected={data["in-2-connected"]}/>
    <div>
        <b>Nand</b>
    </div>
    <OutputHandle id="out-1" enabled={data['out-1']}/>
</div>

<style>
    .node {
        background-color: var(--color-nand);
    }
</style>