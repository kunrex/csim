<script lang="ts">
    import { faPencil } from "@fortawesome/free-solid-svg-icons";
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";

    import { type Node, type Edge, Panel, useOnSelectionChange } from "@xyflow/svelte";

    import { type GateNode } from "$lib/flow/types";

    import InspectorElement from "$lib/flow/panels/inspector/inspector-element.svelte";
    import type { GateInspectorRefData } from "$lib/flow/panels/inspector/gate-inspector-data";
    import { initInspectorData, toggleGateVisibility, setGateSelected } from "$lib/flow/panels/inspector/utils";

    interface InspectorProps {
        title: string,

        renameAssetCallback: () => void,

        expandGateCallback: (gateId: string) => void,
        maximiseGateCallback: (gateId: string) => void,
        renameGateCallback: (gateId: string, name: string) => void
    }

    let { title, renameAssetCallback, expandGateCallback, maximiseGateCallback, renameGateCallback } : InspectorProps = $props();

    let gates: GateInspectorRefData[] = $state.raw([]);

    const selectedNodes = new Set<string>();
    let selectedNodesState: boolean = $state.raw(false);

    useOnSelectionChange(selectionChangeCallback);

    $effect(() => {
        if(!selectedNodesState)
            return;

        selectionChangeHandler();
        selectedNodesState = false;
    });

    export function addGate(gateNode: GateNode) : void {
        if(gateNode.parentId) {
            const parentId = gateNode.parentId;
            const i = gates.findIndex(gate => gate.ref.gateId == parentId);
            if(i >= 0) {
                gates.splice(i + 1, 0, initInspectorData(gateNode, gates[i].ref.depth + 1));
                gates = [...gates];
            }
        }
        else
            gates = [...gates, initInspectorData(gateNode, 0)];
    }

    export function removeGate(gateId : string) : void {
        gates = gates.filter(gate => gate.ref.gateId != gateId);
    }

    function expandGate(gateId : string) : void {
        gates = gates.map((gate: GateInspectorRefData) => {
            if(gate.ref.parentGateId != gateId)
                return gate;

            return toggleGateVisibility(gate);
        });

        expandGateCallback(gateId);
    }

    function selectionChangeCallback(params: { nodes: Node[], edges: Edge[] }) : void {
        selectedNodes.clear();
        for(const node of params.nodes)
            selectedNodes.add(node.id);

        selectedNodesState = true;
    }

    function selectionChangeHandler() : void {
        gates = gates.map((gate: GateInspectorRefData) => {
            return setGateSelected(gate, selectedNodes.has(gate.ref.gateId));
        });
    }
</script>

<Panel class="flex flex-col min-w-64 w-1/6 min-h-72 h-1/2 panel-background text-white p-4" position="top-left">
    <div class="flex flex-row gap-x-2 text-2xl mb-4">
        <div class="flex-1 font-bold overflow-x-scroll overflow-scrollbar">
            { title }
        </div>
        <button class="flex items-center justify-center text-slate-300 hover:text-slate-400 active:text-slate-100 rounded" onclick={renameAssetCallback}>
            <FontAwesomeIcon icon={faPencil}></FontAwesomeIcon>
        </button>
    </div>
    <div class="flex flex-col w-full overflow-y-scroll overflow-x-scroll overflow-scrollbar">
        {#each gates as gate (gate.ref.gateId)}
            <InspectorElement inspectorData={gate} renameGateCallback={renameGateCallback} expandGateCallback={expandGate} maximiseGateCallback={maximiseGateCallback} />
        {/each}
    </div>
</Panel>