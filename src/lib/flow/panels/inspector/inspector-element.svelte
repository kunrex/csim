<script lang="ts">
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
    import { faExpand, faMaximize } from "@fortawesome/free-solid-svg-icons";

    import type { GateNode } from "$lib/flow/types";

    export interface InspectorData {
        gate: GateNode,
        depth: number,
        maximizable: boolean,
        fabIcon: IconDefinition
    }

    interface InspectorElementProps {
        data: InspectorData,
        expandCallback: (gateId: string) => void,
        maximiseCallback: (gateId: string) => void
    }

    let { data, expandCallback, maximiseCallback } : InspectorElementProps = $props();

    let value = $state(data.gate.data.name);
</script>

<div class="flex flex-row items-center gap-2" style={`margin-left: ${data.depth * 25}px;`}>
    <FontAwesomeIcon icon={data.fabIcon} />
    <input class="input-clean w-full" type="text" size="16" minlength="0" maxlength="16" bind:value={value}>
    <button class="inspector-utility-button" onclick={() => expandCallback(data.gate.id)} disabled={!data.maximizable || data.gate.type !== "prefab"}>
        <FontAwesomeIcon icon={faExpand} />
    </button>
    <button class="inspector-utility-button" onclick={() => maximiseCallback(data.gate.id)} disabled={!data.maximizable}>
        <FontAwesomeIcon icon={faMaximize} />
    </button>
</div>