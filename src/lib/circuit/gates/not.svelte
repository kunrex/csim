<script lang="ts">
    import { Position } from '@xyflow/svelte';

    import type { GateData } from "$lib/types";
    import HandlerWrapper from '$lib/circuit/handler-wrapper.svelte';

    export let data: GateData;
    export let dragging = false;
    export let selected = false;
</script>

<div class="node" class:dragging class:selected>
    <HandlerWrapper type="target" position={Position.Left} id="in-1" enabled={data['in-1']}/>
    <div>
        <b>Not</b>
    </div>
    <HandlerWrapper type="source" position={Position.Right} id="out-1" enabled={data['out-1']}/>
</div>

<style>
    .node {
        background-color: var(--color-not);
    }
</style>