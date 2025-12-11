<script lang="ts">
    import { Handle, Position, useNodeConnections } from "@xyflow/svelte";

    import type { PinProps } from "$lib/flow/types";

    let { id, label, enabled, position = Position.Left, connectable, ...rest } : PinProps = $props();

    const connections = useNodeConnections({ handleId: id, handleType: 'target' });
    let isConnectable = $derived(connectable && connections.current.length === 0);
</script>

<Handle class={`handle-popup-parent group ${enabled ? '!bg-rose-600' : ''}`} type="target" position={position} id={id} {isConnectable} {...rest}>
    <div class="handle-popup right-4 -top-1/2">
        { label }
    </div>
</Handle>