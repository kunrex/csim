<script lang="ts">
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

    import type { GateType } from "$lib/core";

    import { capitalise } from "$lib/flow/utils.js";
    import { dragDropProvider}  from "$lib/flow/drag-drop";

    interface InstantiateGateButtonProps {
        type: GateType,

        color: string,
        fabIcon?: IconDefinition
    }

    let { type, color, fabIcon = undefined } : InstantiateGateButtonProps = $props();

    const dragDropType = dragDropProvider();
    function onDragStart(event: DragEvent) : void {
        if(!event.dataTransfer)
            return;

        dragDropType.current = type;
        event.dataTransfer.effectAllowed = 'move';
    }
</script>

<div class={`${color} instantiate-gate-button`} role="img" draggable={true} ondragstart={onDragStart}>
    {#if fabIcon}
        <FontAwesomeIcon icon={fabIcon}/>
    {:else}
        <b>{ capitalise(type.name) }</b>
    {/if}
</div>
