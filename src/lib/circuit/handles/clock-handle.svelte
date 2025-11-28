<script lang="ts">
    import { Handle, Position } from "@xyflow/svelte";

    export let id = "";
    export let enabled = false;
</script>

<Handle type="target" position={Position.Top} id={id} {...$$restProps} class={enabled ? '!bg-rose-600': ''}/>