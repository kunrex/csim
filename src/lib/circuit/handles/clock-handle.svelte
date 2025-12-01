<script lang="ts">
    import { Handle, Position } from "@xyflow/svelte";

    export let id = "";
    export let enabled = false;
</script>

<Handle class={`handle-popup-parent group ${enabled ? '!bg-rose-600' : ''}`} type="target" position={Position.Top} id={id} {...$$restProps}>
    <div class="handle-popup left-1/2 -translate-x-1/2 -top-7">
        { id }
    </div>
</Handle>