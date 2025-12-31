<script lang="ts">
    import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";

    import type {AssetGateType, GateType} from "$lib/core";

    import { capitalise } from "$lib/flow/utils.js";
    import { AssetTypeStore } from "$lib/flow/types";

    export interface InstantiateGateButtonProps {
        disabled: boolean;
        typeStore: AssetTypeStore,

        openCircuitCallback: (gateType: GateType) => void,
        deleteCircuitCallback: (gateType: GateType) => void,
    }

    let { disabled, typeStore, openCircuitCallback, deleteCircuitCallback } : InstantiateGateButtonProps = $props();

    let gateType: AssetGateType = $state.raw(typeStore.gateType);
    typeStore.state.subscribe((state) => {
        gateType = state;
    });

    function editCircuit() {
        openCircuitCallback(gateType);
    }

    function deleteCircuit() {
        deleteCircuitCallback(gateType);
    }
</script>

<div class="flex flex-row">
    <button class="color-circuit instantiate-gate-button rounded-br-none hover:cursor-pointer" ondblclick={editCircuit}>
        <b>{ capitalise(gateType.name) }</b>
    </button>
    <div class="flex flex-col justify-end">
        <button class="instantiate-gate-utility" onclick={deleteCircuit} disabled={disabled} class:disabled>
            <FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>
        </button>
    </div>
</div>

