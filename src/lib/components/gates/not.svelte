<script lang="ts">
    import { Position } from '@xyflow/svelte';

    import Connector from '$lib/components/connector.svelte';

    export let dragging = false;
    export let selected = false;
</script>

<div class="node" class:dragging class:selected>
    <Connector type="target" position={Position.Left} id="in-1"/>
    <div>
        <b>Not</b>
    </div>
    <Connector type="source" position={Position.Right} id="out-3"/>
</div>

<style>
    .node {
        background-color: var(--color-not);
    }
</style>