<script lang="ts">
    import { Panel } from "@xyflow/svelte";

    import type {GateType} from "$lib/core";

    import { nonIconGateTypes, iconGateTypes } from "$lib/flow/constants";

    import AssetWindow from "./asset-window-button.svelte";
    import InstantiateGate from "./instantiate-gate-button.svelte";

    let showCore = $state(true);

    const allPrefabTypes: string[] = [];
    let displayedPrefabTypes: string[] = $state([]);

    export function addPrefabType(prefab: GateType): void {
        allPrefabTypes.push(prefab);
        displayedPrefabTypes = [...displayedPrefabTypes, prefab];
    }

    export function resetPrefabOptions(): void {
        displayedPrefabTypes = [...allPrefabTypes];
    }

    export function disablePrefabOption(name: GateType): void {
        displayedPrefabTypes = displayedPrefabTypes.filter(prefab => prefab !== name);
    }
</script>

<Panel class="flex flex-col h-auto w-1/2 absolute panel-background" position="bottom-right">
    <div class="flex flex-row justify-start absolute top-0 left-0 -translate-y-full px-2">
        <AssetWindow title="Core" onclick={() => { showCore = true; }} selected={showCore}></AssetWindow>
        <AssetWindow title="Prefabs" onclick={() => { showCore = false; }} selected={!showCore}></AssetWindow>
    </div>
    <div class="flex flex-row items-center min-h-16 w-full overflow-x-auto gap-x-4">
        {#if showCore }
            {#each nonIconGateTypes as type}
                <InstantiateGate type={type} color={`color-${type}`}></InstantiateGate>
            {/each}
            {#each iconGateTypes as type}
                <InstantiateGate type={type[0]} fabIcon={type[1]} color={`color-${type[0]}`}></InstantiateGate>
            {/each}
        {:else}
            {#if displayedPrefabTypes.length > 0 }
                {#each displayedPrefabTypes as prefabType}
                    <InstantiateGate type={prefabType} color="color-prefab"></InstantiateGate>
                {/each}
            {:else}
                <div class="w-full text-white text-2xl text-center">
                    <b>No Prefabs</b>
                </div>
            {/if}
        {/if}
    </div>
</Panel>
