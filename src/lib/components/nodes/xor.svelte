<script lang="ts">
    import { Handle, Position, type NodeProps } from '@xyflow/svelte';
    import { topRight, bottomRight } from "$lib/components/constants";

    export let dragging = false;
</script>

<div class="node" class:dragging>
    <Handle type="target" position={Position.Left} id="in-1" style="{topRight}"/>
    <Handle type="target" position={Position.Left} id="in-2" style="{bottomRight}"/>
    <div>
        <b>Xor</b>
    </div>
    <Handle type="source" position={Position.Right} id="out-3"/>
</div>
