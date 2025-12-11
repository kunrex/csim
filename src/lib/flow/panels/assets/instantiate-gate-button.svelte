<script lang="ts">
    import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";

    import type { GateType } from "$lib/core";

    import { capitalise } from "$lib/flow/utils.js";
    import { useDragDrop}  from "$lib/flow/drag-drop";

    interface InstantiateGateButtonProps {
        color: string,
        type: GateType,
        disabled: boolean,
        fabIcon?: IconDefinition
    }

    let { color, type, disabled, fabIcon } : InstantiateGateButtonProps = $props();

    const dragDropType = useDragDrop();
    function onDragStart(event: DragEvent) : void {
        if(!event.dataTransfer || disabled)
            return;

        dragDropType.current = type;
        event.dataTransfer.effectAllowed = 'move';
    }
</script>

<div class={`${color} instantiate-gate-button`} role="img" draggable={true} ondragstart={onDragStart} class:disabled>
    {#if fabIcon}
        <FontAwesomeIcon icon={fabIcon}/>
    {:else}
        <b>{ capitalise(type) }</b>
    {/if}
</div>
