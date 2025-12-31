<script lang="ts">
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
    import { faExpand, faMaximize } from "@fortawesome/free-solid-svg-icons";

    export interface InspectorData {
        id: string,
        parentId?: string,

        isPrefab: boolean,
        initialName: string,

        selected: boolean,

        depth: number,
        maximizable: boolean,
        fabIcon: IconDefinition
    }

    interface InspectorElementProps {
        inspectorData: InspectorData,

        expandGateCallback: (gateId: string) => void,
        maximiseGateCallback: (gateId: string) => void,
        renameGateCallback: (gateId: string, name: string) => void
    }

    let { inspectorData, expandGateCallback, maximiseGateCallback, renameGateCallback } : InspectorElementProps = $props();

    let value = $state(inspectorData.initialName);

    function rename() : void {
        renameGateCallback(inspectorData.id, value);
    }
</script>

{#if inspectorData.maximizable }
    <div class="inspector-element" style={`margin-left: ${inspectorData.depth * 25}px;`} class:selected={inspectorData.selected}>
        <FontAwesomeIcon icon={inspectorData.fabIcon} />
        <input class="input-clean w-full" type="text" size="16" minlength="0" maxlength="16" bind:value={value} onchange={rename}>
        <button class="inspector-utility-button" onclick={() => expandGateCallback(inspectorData.id)} disabled={!inspectorData.maximizable || !inspectorData.isPrefab}>
            <FontAwesomeIcon icon={faExpand} />
        </button>
        <button class="inspector-utility-button" onclick={() => maximiseGateCallback(inspectorData.id)} disabled={!inspectorData.maximizable}>
            <FontAwesomeIcon icon={faMaximize} />
        </button>
    </div>
{/if}