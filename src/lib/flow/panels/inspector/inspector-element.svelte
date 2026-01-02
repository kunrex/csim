<script lang="ts">
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import { faExpand, faMaximize } from "@fortawesome/free-solid-svg-icons";

    import type { GateInspectorRefData } from "$lib/flow/panels/inspector/gate-inspector-data";

    interface InspectorElementProps {
        inspectorData: GateInspectorRefData,

        expandGateCallback: (gateId: string) => void,
        maximiseGateCallback: (gateId: string) => void,
        renameGateCallback: (gateId: string, name: string) => void
    }

    let { inspectorData, expandGateCallback, maximiseGateCallback, renameGateCallback } : InspectorElementProps = $props();

    const depth = inspectorData.ref.depth;
    const icon = inspectorData.ref.fabIcon;
    const gateId = inspectorData.ref.gateId;
    const expandable = inspectorData.ref.expandable;

    let value = $state(inspectorData.ref.name);
    function rename() : void {
        renameGateCallback(inspectorData.ref.gateId, value);
    }
</script>

{#if inspectorData.ref.visible }
    <div class="inspector-element" style={`margin-left: ${depth * 25}px;`} class:selected={inspectorData.ref.selected}>
        <FontAwesomeIcon icon={icon} />
        <input class="input-clean w-full" type="text" size="16" minlength="0" maxlength="16" bind:value={value} onchange={rename}>
        <button class="inspector-utility-button" onclick={() => expandGateCallback(gateId)} disabled={!expandable || !inspectorData.ref.visible}>
            <FontAwesomeIcon icon={faExpand} />
        </button>
        <button class="inspector-utility-button" onclick={() => maximiseGateCallback(gateId)} disabled={!inspectorData.ref.visible}>
            <FontAwesomeIcon icon={faMaximize} />
        </button>
    </div>
{/if}