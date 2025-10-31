<script lang="ts">
    import { Handle, Position, type NodeProps } from '@xyflow/svelte';

    export let dragging = false;
</script>

<div class="node" class:dragging>
    <Handle type="target" position={Position.Left} id="in-1"/>
    <div>
        <b>Not</b>
    </div>
    <Handle type="source" position={Position.Right} id="out-3"/>
</div>
