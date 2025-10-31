<script lang="ts">
    import { Handle, Position } from "@xyflow/svelte";

    export let id = "";
    export let position: Position = Position.Top;
    export let type: "source" | "target" = "source";

    let enabled = false;
    export function setState(state: boolean) {
        enabled = state;
    }
</script>

<Handle type={type} position={position} id={id} {...$$restProps} class={enabled ? '!bg-rose-600': ''}/>

