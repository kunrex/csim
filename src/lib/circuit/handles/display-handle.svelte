<script lang="ts">
    import { Handle, Position } from "@xyflow/svelte";

    export let id = "";
    export let enabled = false;
</script>

<Handle class={`handle-popup-parent group ${enabled ? '!bg-rose-600' : ''}`} type="source" position={Position.Bottom} id={id} {...$$restProps}>
    <div class="handle-popup left-1/2 -translate-x-1/2 -bottom-7">
        { id }
    </div>
</Handle>