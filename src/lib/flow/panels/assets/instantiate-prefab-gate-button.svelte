<script lang="ts">
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import { faPencil, faTrashCan } from "@fortawesome/free-solid-svg-icons";

    import { playAudio } from "$lib/audio";
    import type { GateType } from "$lib/core";

    import { capitalise } from "$lib/flow/utils";
    import { AssetTypeStore } from "$lib/flow/types";
    import { dragDropProvider } from "$lib/flow/drag-drop";

    interface InstantiatePrefabGateButtonProps {
        disabled: boolean,
        deletable: boolean,
        typeStore: AssetTypeStore,

        openPrefabCallback: (gateType: GateType) => void,
        deletePrefabCallback: (gateType: GateType) => void
    }

    let { disabled, deletable, typeStore, openPrefabCallback, deletePrefabCallback } : InstantiatePrefabGateButtonProps = $props();

    let name: string = $state.raw("");
    typeStore.state.subscribe((state) => {
        name = state.name;
    });

    const dragDropType = dragDropProvider();
    function onDragStart(event: DragEvent) : void {
        if(!event.dataTransfer || disabled)
            return;

        dragDropType.current = typeStore.gateType;
        event.dataTransfer.effectAllowed = 'move';
    }

    function editPrefab() : void {
        playAudio("click");
        openPrefabCallback(typeStore.gateType);
    }

    function deletePrefab() : void {
        deletePrefabCallback(typeStore.gateType);
    }
</script>

<div class="flex flex-row">
    <div class="color-prefab instantiate-gate-button rounded-r-none" role="img" draggable={true} ondragstart={onDragStart} class:disabled={disabled}>
        <b>{ capitalise(name) }</b>
    </div>
    <div class="flex flex-col justify-between">
        <button class="instantiate-gate-utility" onclick={editPrefab}>
            <FontAwesomeIcon icon={faPencil}></FontAwesomeIcon>
        </button>
        <button class="instantiate-gate-utility" onclick={deletePrefab} disabled={!deletable} class:disabled={!deletable}>
            <FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>
        </button>
    </div>
</div>
