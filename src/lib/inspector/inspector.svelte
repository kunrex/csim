<script lang="ts">
    import { Gate } from "$lib/logic";

    import { iconMap } from "$lib/inspector/constants";
    import InspectorElement from "$lib/inspector/inspector-element.svelte";

    let gates: Gate[] = [];
    export function addGate(gate: Gate): void {
        gates = [... gates, gate];
    }

    export function removeGate(gateId: string): void {
        gates = gates.filter(g => g.id !== gateId);
    }
</script>

<div class="flex flex-col min-w-64 w-1/6 fixed top-0 left-0 ml-8 mt-8 ui-element text-white p-4">
    <div class="font-bold text-2xl mb-2 overflow-y-scroll">
        Scene
    </div>
    <div class="min-h-72 h-1/4 overflow-x-scroll overflow-y-scroll px-2">
        {#each gates as gate}
            <InspectorElement gate={gate} fabIcon={iconMap(gate.gateType())}></InspectorElement>
        {/each}
    </div>
</div>