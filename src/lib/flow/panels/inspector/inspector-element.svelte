<script lang="ts">
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import { faExpand, faMaximize } from "@fortawesome/free-solid-svg-icons";

    import type { InspectorData } from "$lib/flow/panels/inspector/inspector-data";

    interface InspectorElementProps {
        data: InspectorData,
        expandCallback: (gateId: string) => void,
        maximiseCallback: (gateId: string) => void
    }

    let { data, expandCallback, maximiseCallback } : InspectorElementProps = $props();
</script>

<div class={`flex flex-row items-center gap-2 ml-[${data.depth * 10}px]`}>
    <FontAwesomeIcon icon={data.fabIcon} />
    <input class="input-clean w-full" type="text" disabled={data.depth > 0} size="16" minlength="0" maxlength="16" bind:value={data.gate.data.name}>
    <button class="inspector-utility-button" onclick={() => expandCallback(data.gate.id)} disabled={!data.focused || data.gate.type !== "prefab"}>
        <FontAwesomeIcon icon={faExpand} />
    </button>
    <button class="inspector-utility-button" onclick={() => maximiseCallback(data.gate.id)} disabled={!data.focused}>
        <FontAwesomeIcon icon={faMaximize} />
    </button>
</div>