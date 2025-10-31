<script lang="ts">
    import { Handle, Position, type NodeProps } from '@xyflow/svelte';

    import Connector from '$lib/components/connector.svelte';
    import { topRight, bottomRight } from "$lib/components/constants";

    export let dragging = false;
</script>

<div class="node" class:dragging>
    <Connector type="target" position={Position.Left} id="in-1" style="{topRight}"/>
    <Connector type="target" position={Position.Left} id="in-2" style="{bottomRight}"/>
    <div>
        <b>Xor</b>
    </div>
    <Connector type="source" position={Position.Right} id="out-3"/>
</div>
