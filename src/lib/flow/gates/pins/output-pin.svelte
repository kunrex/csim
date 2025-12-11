<script lang="ts">
    import { Handle, Position } from "@xyflow/svelte";

    import type { PinProps } from "$lib/flow/types";

    let { id, label, enabled, position = Position.Right, connectable, ...rest } : PinProps = $props();
</script>

<Handle class={`handle-popup-parent group ${enabled ? '!bg-rose-600' : ''}`} type="source" position={position} isConnectable={connectable} id={id} {...rest}>
    <div class="handle-popup left-4 -top-1/2">
        { label }
    </div>
</Handle>