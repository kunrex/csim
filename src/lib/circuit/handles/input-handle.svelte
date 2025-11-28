<script lang="ts">
    import { Handle, Position } from "@xyflow/svelte";

    export let id = "";
    export let enabled = false;
</script>

<Handle class={`gate-handle group ${enabled ? "bg-rose-600" : ""}`} type="target" position={Position.Left} id={id} {...$$restProps}>
    <div class="gate-handle-popup right-4 -top-1/2">
        { id }
    </div>
</Handle>
