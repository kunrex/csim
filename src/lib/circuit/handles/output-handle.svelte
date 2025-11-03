<script lang="ts">
    import { Handle, Position } from "@xyflow/svelte";

    export let id = "";
    export let enabled = false;
</script>

<Handle type="source" position={Position.Right} id={id} {...$$restProps} class={enabled ? '!bg-rose-600': ''}/>
