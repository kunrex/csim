<script lang="ts">
    import { faPencil } from "@fortawesome/free-solid-svg-icons";
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";

    import { type Node, type Edge, Panel, useOnSelectionChange } from "@xyflow/svelte";

    import { type GateNode } from "$lib/flow/types";
    import { initInspectorData } from "$lib/flow/panels/inspector/utils";
    import InspectorElement, { type InspectorData } from "$lib/flow/panels/inspector/inspector-element.svelte";

    interface InspectorProps {
        title: string,

        renameAssetCallback: () => void,

        expandGateCallback: (gateId: string) => void,
        maximiseGateCallback: (gateId: string) => void,
        renameGateCallback: (gateId: string, name: string) => void
    }

    let { title, renameAssetCallback, expandGateCallback, maximiseGateCallback, renameGateCallback } : InspectorProps = $props();

    let gates: InspectorData[] = $state([]);

    useOnSelectionChange(onSelectionChange);

    export function addGate(gate: GateNode) : void {
        if(gate.parentId) {
            const i = gates.findIndex(data => data.id == gate.parentId);
            if(i >= 0) {
                const copy = [...gates];
                copy.splice(i + 1, 0, initInspectorData(gate, gates[i].depth + 1));
                gates = copy;
            }
        }
        else
            gates = [...gates, initInspectorData(gate, 0)];
    }

    export function removeGate(gateId : string) : void {
        gates = gates.filter(data => data.id != gateId);
    }

    function expandGate(gateId : string) : void {
        for(const gate of gates)
            if (gate.parentId == gateId)
                gate.maximizable = !gate.maximizable;

        expandGateCallback(gateId);
    }

    const selectedNodes = new Set<string>();
    function onSelectionChange(params: { nodes: Node[], edges: Edge[] }) : void {
        selectedNodes.clear();
        for(const node of params.nodes)
            selectedNodes.add(node.id);

        for(const gate of gates)
            gate.selected = selectedNodes.has(gate.id);
    }
</script>

<Panel class="flex flex-col min-w-64 w-1/6 min-h-72 h-1/2 panel-background text-white p-4" position="top-left">
    <div class="flex flex-row gap-x-2 text-2xl mb-4">
        <div class="flex-1 font-bold overflow-x-scroll">
            { title }
        </div>
        <button class="flex items-center justify-center text-slate-300 hover:text-slate-400 active:text-slate-100 rounded" onclick={renameAssetCallback}>
            <FontAwesomeIcon icon={faPencil}></FontAwesomeIcon>
        </button>
    </div>
    <div class="flex flex-col w-full overflow-y-scroll overflow-x-scroll pl-2">
        {#each gates as data}
            <InspectorElement inspectorData={data} renameGateCallback={renameGateCallback} expandGateCallback={expandGate} maximiseGateCallback={maximiseGateCallback} />
        {/each}
    </div>
</Panel>