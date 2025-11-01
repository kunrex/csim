<script lang="ts">
    import { Position } from '@xyflow/svelte';

    import type { GateData } from "$lib/types";
    import HandlerWrapper from '$lib/circuit/handler-wrapper.svelte';
    import { topRight, bottomRight } from "$lib/circuit/constants";

    export let data: GateData;
    export let dragging = false;
    export let selected = false;
</script>

<div class="node" class:dragging class:selected>
    <HandlerWrapper type="target" position={Position.Left} id="in-1" style="{topRight}" enabled={data['in-1']}/>
    <HandlerWrapper type="target" position={Position.Left} id="in-2" style="{bottomRight}" enabled={data['in-2']}/>
    <div>
        <b>Nand</b>
    </div>
    <HandlerWrapper type="source" position={Position.Right} id="out-1" enabled={data['out-1']}/>
</div>

<style>
    .node {
        background-color: var(--color-nand);
    }
</style>