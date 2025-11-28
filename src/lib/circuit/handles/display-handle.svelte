<script lang="ts">
    import { Handle, Position } from "@xyflow/svelte";

    export let id = "";
    export let enabled = false;
</script>

<Handle class={`gate-handle group ${enabled ? "bg-rose-600" : ""}`} type="source" position={Position.Bottom} id={id} {...$$restProps}>
    <div class="gate-handle-popup -right-full -bottom-7">
        { id }
    </div>
</Handle>
