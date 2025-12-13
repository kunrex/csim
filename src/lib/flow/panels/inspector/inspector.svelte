<script lang="ts">
    import { Panel } from "@xyflow/svelte";

    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons";

    import { type GateNode } from "$lib/flow/types";
    import { iconMap } from "$lib/flow/panels/inspector/utils";
    import InspectorElement, { type InspectorData } from "$lib/flow/panels/inspector/inspector-element.svelte";

    interface InspectorProps {
        title: string,
        refocusCallback: () => void,
        expandCallback: (gateId: string) => void,
        maximiseCallback: (gateId: string) => void
    }

    let { title, refocusCallback, expandCallback, maximiseCallback } : InspectorProps = $props();

    let focused = $state(false);
    let gates: InspectorData[] = $state([]);

    export function addGate(gate: GateNode) : void {
        if(gate.parentId) {
            const i = gates.findIndex(data => data.gate.id == gate.parentId);
            if(i >= 0) {
                const copy = [...gates];
                copy.splice(i + 1, 0, { gate: gate, fabIcon: iconMap(gate.data.type), depth: gates[i].depth + 1, maximizable: false });
                gates = copy;
            }
        }
        else
            gates = [...gates, { gate: gate, fabIcon: iconMap(gate.data.type), depth: 0, maximizable: true }];
    }

    export function removeGate(gateId : string) : void {
        gates = gates.filter(data => data.gate.id != gateId);
    }

    function refocus() {
        for(const data of gates)
            data.maximizable = data.depth == 0;

        focused = false;
        refocusCallback();
    }

    function expandGate(gateId : string) : void {
        for(const data of gates)
            data.maximizable = data.maximizable || (data.gate.parentId === gateId);

        focused = true;
        expandCallback(gateId);
    }
</script>

<Panel class="flex flex-col min-w-64 w-1/6 panel-background text-white p-4" position="top-left">
    <div class="flex flex-row text-2xl mb-2">
        <div class="flex-1 font-bold overflow-x-scroll">
            { title }
        </div>
        <button class="flex items-center justify-center text-emerald-500 disabled:text-emerald-800 hover:text-emerald-400 disabled:cursor-not-allowed rounded" onclick={refocus} disabled={!focused}>
            <FontAwesomeIcon icon={faCircleChevronLeft}></FontAwesomeIcon>
        </button>
    </div>
    <div class="flex flex-col min-h-72 w-full h-1/4 overflow-y-scroll overflow-x-scroll gap-y-1 pl-2">
        {#each gates as data}
            <InspectorElement expandCallback={expandGate} maximiseCallback={maximiseCallback} data={data} />
        {/each}
    </div>
</Panel>