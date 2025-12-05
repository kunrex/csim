<script lang="ts">
    import { Panel } from "@xyflow/svelte";

    import type { GateNode } from "$lib/flow/types";
    import { iconMap } from "$lib/flow/panels/inspector/utils";
    import { InspectorData } from "$lib/flow/panels/inspector/inspector-data";
    import InspectorElement from "$lib/flow/panels/inspector/inspector-element.svelte";

    export let title: string = "";

    let depth = 0;
    let gates: InspectorData[] = [];

    export function refocus() {
        for(const data of gates)
            data.focused = data.depth == 0;
    }

    export function addGate(gate: GateNode) : void {
        if(gate.parentId) {
            const i = gates.findIndex(data => data.gate.id == gate.parentId);
            if(i >= 0)
                gates.splice(i, 0, new InspectorData(gate, iconMap(gate.data["gate"]), gates[i].depth + 1, false));
        }
        else
            gates.push(new InspectorData(gate, iconMap(gate.data["gate"]), 0, true));
    }

    export function focusGate(gateId : string) : void {
        for(const data of gates)
            data.focused = data.gate.parentId === gateId;
    }

    export function removeGate(gateId : string) : void {
        gates = gates.filter(data => data.gate.id == gateId);
    }
</script>

<Panel class="flex flex-col min-w-64 w-1/6 panel-background text-white p-4" position="top-left">
    <div class="font-bold text-2xl mb-2 overflow-y-scroll">
        { title }
    </div>
    <div class="min-h-72 w-full h-1/4 overflow-y-scroll gap-x-1 px-2">
        {#each gates as data}
            <InspectorElement data={data}></InspectorElement>
        {/each}
    </div>
</Panel>