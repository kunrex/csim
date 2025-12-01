<script lang="ts">
    import { Gate } from "$lib/logic";

    import { iconMap } from "$lib/windows/inspector/utils";
    import InspectorElement from "$lib/windows/inspector/inspector-element.svelte";

    export let title: string = "";
    let gates: Gate[] = [];
    export function addGate(gate: Gate): void {
        gates = [... gates, gate];
    }

    export function removeGate(gateId: string): void {
        gates = gates.filter(gate => gate.id != gateId);
    }
    export let onEdit: (gateId: string) => void;
    export let onMaximise: (gateId: string) => void;
</script>

<div class="flex flex-col min-w-64 w-1/6 fixed top-0 left-0 ml-8 mt-8 ui-element text-white p-4">
    <div class="font-bold text-2xl mb-2 overflow-y-scroll">
        { title }
    </div>
    <div class="min-h-72 w-full h-1/4 overflow-y-scroll px-2">
        {#each gates as gate}
            <InspectorElement gate={gate} fabIcon={iconMap(gate.gateType())} onEdit={onEdit} onMaximise={onMaximise}></InspectorElement>
        {/each}
    </div>
</div>