<script lang="ts">
    import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";

    import type { GateType } from "$lib/core";

    import { capitalise } from "$lib/flow/utils";
    import { AssetTypeStore } from "$lib/flow/types";

    export interface InstantiateGateButtonProps {
        disabled: boolean;
        typeStore: AssetTypeStore,

        openCircuitCallback: (gateType: GateType) => void,
        deleteCircuitCallback: (gateType: GateType) => void,
    }

    let { disabled, typeStore, openCircuitCallback, deleteCircuitCallback } : InstantiateGateButtonProps = $props();

    let name: string = $state.raw("");
    typeStore.state.subscribe((state) => {
        name = state.name;
    });

    function editCircuit() {
        openCircuitCallback(typeStore.gateType);
    }

    function deleteCircuit() {
        deleteCircuitCallback(typeStore.gateType);
    }
</script>

<div class="flex flex-row">
    <button class="color-circuit instantiate-gate-button rounded-br-none hover:cursor-pointer" ondblclick={editCircuit}>
        <b>{ capitalise(name) }</b>
    </button>
    <div class="flex flex-col justify-end">
        <button class="instantiate-gate-utility" onclick={deleteCircuit} disabled={disabled} class:disabled>
            <FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>
        </button>
    </div>
</div>

