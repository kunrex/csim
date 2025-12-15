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
        data: InspectorData,
        expandCallback: (gateId: string) => void,
        maximiseCallback: (gateId: string) => void,
        renameGateCallback: (gateId: string, name: string) => void
    }

    let { data, expandCallback, maximiseCallback, renameGateCallback } : InspectorElementProps = $props();

    let value = $state(data.initialName);

    function rename() : void {
        renameGateCallback(data.id, value);
    }
</script>

{#if data.maximizable }
    <div class="inspector-element" style={`margin-left: ${data.depth * 25}px;`} class:selected={data.selected}>
        <FontAwesomeIcon icon={data.fabIcon} />
        <input class="input-clean w-full" type="text" size="16" minlength="0" maxlength="16" bind:value={value} onchange={rename}>
        <button class="inspector-utility-button" onclick={() => expandCallback(data.id)} disabled={!data.maximizable || !data.isPrefab}>
            <FontAwesomeIcon icon={faExpand} />
        </button>
        <button class="inspector-utility-button" onclick={() => maximiseCallback(data.id)} disabled={!data.maximizable}>
            <FontAwesomeIcon icon={faMaximize} />
        </button>
    </div>
{/if}