<script lang="ts">
    import { Handle, Position } from "@xyflow/svelte";

    export let id = "";
    export let position: Position = Position.Top;
    export let type: "source" | "target" = "source";

    export let enabled = false;
</script>

<Handle type={type} position={position} id={id} {...$$restProps} class={enabled ? '!bg-rose-600': ''}/>
